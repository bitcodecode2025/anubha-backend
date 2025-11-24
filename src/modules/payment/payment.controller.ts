// src/modules/payment/payment.controller.ts
import { Request, Response } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import prisma from "../../database/prismaclient";
import { getSingleAdminId } from "../slots/slots.services";
import { PLANS, PlanSlug } from "../../constants/plan";
import { AppointmentMode, Prisma } from "@prisma/client";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

/* -------------------------------------------------
   HELPER: Normalize appointmentMode → Prisma enum
-------------------------------------------------- */
export function normalizeAppointmentMode(input: string): AppointmentMode {
  const v = (input || "").toLowerCase().trim();

  // Allow multiple synonyms
  if (["in-person", "in_person", "clinic", "offline", "inperson"].includes(v)) {
    return AppointmentMode.IN_PERSON;
  }

  if (["online", "virtual", "video", "zoom"].includes(v)) {
    return AppointmentMode.ONLINE;
  }

  throw new Error("Invalid appointment mode");
}
/* -------------------------------------------------
   WEBHOOK HANDLER (Razorpay → server)
-------------------------------------------------- */
export async function razorpayWebhookHandler(req: Request, res: Response) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const signature = req.headers["x-razorpay-signature"] as string | undefined;
    const eventId = req.headers["x-razorpay-event-id"] as string | undefined;

    if (!signature || !eventId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing headers" });
    }

    // 1️⃣ Idempotency: skip if already processed
    const exists = await prisma.webhookEvent.findUnique({
      where: { eventId },
    });

    if (exists) {
      console.log("⚠️ Duplicate webhook ignored:", eventId);
      return res.json({ success: true });
    }

    // 2️⃣ Verify signature (req.body MUST be raw Buffer)
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("❌ Invalid Razorpay signature");
      return res.status(400).json({ success: false });
    }

    const event = JSON.parse(req.body.toString());
    const eventType = event.event as string;

    // 3️⃣ Mark event as processed (idempotency)
    await prisma.webhookEvent.create({
      data: { eventId },
    });

    console.log("🔔 Razorpay Event:", eventType);

    // 4️⃣ Handle SUCCESS — keep it simple: ONLY payment.captured for now
    if (eventType === "payment.captured") {
      const orderId = event.payload.payment?.entity?.order_id as
        | string
        | undefined;

      if (!orderId) {
        console.warn("⚠️ payment.captured without order_id");
        return res.json({ success: true });
      }

      const appointment = await prisma.appointment.findFirst({
        where: { paymentId: orderId },
      });

      if (!appointment) {
        console.error("❌ No appointment found for order:", orderId);
        return res.json({ success: true });
      }

      // Don't downgrade status
      if (
        appointment.status === "CANCELLED" ||
        appointment.status === "COMPLETED" ||
        appointment.status === "CONFIRMED"
      ) {
        return res.json({ success: true });
      }

      // Confirm appointment
      await prisma.appointment.update({
        where: { id: appointment.id },
        data: { status: "CONFIRMED" },
      });

      // Mark slot as booked
      if (appointment.slotId) {
        await prisma.slot.update({
          where: { id: appointment.slotId },
          data: { isBooked: true },
        });
      }

      console.log("✅ Appointment CONFIRMED:", appointment.id);
    }

    // 5️⃣ Handle FAILED (but don't override CONFIRMED)
    if (eventType === "payment.failed") {
      const orderId = event.payload.payment?.entity?.order_id as
        | string
        | undefined;

      if (!orderId) {
        return res.json({ success: true });
      }

      const appointment = await prisma.appointment.findFirst({
        where: { paymentId: orderId },
      });

      if (!appointment) return res.json({ success: true });

      // if already confirmed, ignore failure
      if (appointment.status === "CONFIRMED")
        return res.json({ success: true });

      await prisma.appointment.update({
        where: { id: appointment.id },
        data: { status: "PENDING" }, // you can also set a custom "PAYMENT_FAILED" later
      });

      console.log("⚠️ Payment FAILED for appointment:", appointment.id);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(500).json({ success: false });
  }
}

/* -------------------------------------------------
   CREATE ORDER (user hits "Pay Now")
-------------------------------------------------- */
export async function createOrderHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthenticated" });
    }

    const { slotId, patientId, planSlug, appointmentMode } = req.body as {
      slotId: string;
      patientId: string;
      planSlug: PlanSlug;
      appointmentMode: string;
    };

    if (!slotId || !patientId || !planSlug || !appointmentMode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1️⃣ Validate planSlug and derive price from backend
    const plan = PLANS[planSlug];
    if (!plan) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    // 2️⃣ Normalize appointmentMode -> enum
    const modeEnum = normalizeAppointmentMode(appointmentMode);
    if (!modeEnum) {
      return res.status(400).json({ error: "Invalid appointment mode" });
    }

    // 3️⃣ Validate that patient belongs to logged-in user
    const patient = await prisma.patientDetials.findFirst({
      where: {
        id: patientId,
        userId,
      },
    });

    if (!patient) {
      return res
        .status(403)
        .json({ error: "Patient does not belong to current user" });
    }

    // 4️⃣ Ensure slot exists, is not booked, and matches mode
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      return res.status(400).json({ error: "Slot not found" });
    }

    if (slot.isBooked) {
      return res.status(400).json({ error: "Slot already booked" });
    }

    if (slot.mode !== modeEnum) {
      return res
        .status(400)
        .json({ error: "Slot mode does not match selected mode" });
    }

    // Optional: prevent booking past slots
    if (slot.startAt <= new Date()) {
      return res.status(400).json({ error: "Slot is in the past" });
    }

    // 5️⃣ Prepare amount from backend config (INR → paise)
    const amountInPaise = plan.price * 100;

    // 6️⃣ Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const doctorId = await getSingleAdminId();

    // 7️⃣ Create Appointment in PENDING state
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        doctorId,
        patientId,
        slotId: slot.id,
        startAt: slot.startAt,
        endAt: slot.endAt,

        paymentId: order.id,
        amount: plan.price,
        status: "PENDING",
        mode: modeEnum,

        planSlug,
        planName: plan.name,
        planPrice: plan.price,
        planDuration: plan.duration,
        planPackageName: plan.packageName,
      },
    });

    return res.json({
      success: true,
      order,
      appointmentId: appointment.id,
    });
  } catch (err: any) {
    // Handle unique constraint -> slot double booking race condition
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002" &&
      Array.isArray(err.meta?.target) &&
      err.meta?.target.includes("slotId")
    ) {
      return res.status(409).json({ error: "Slot already booked" });
    }

    console.error("Create order error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

// --------------------------------------------
// VERIFY PAYMENT HANDLER (fallback for frontend)
// --------------------------------------------
export async function verifyPaymentHandler(req: Request, res: Response) {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // 1️⃣ Verify signature EXACT logic Razorpay provides
    const body = `${orderId}|${paymentId}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== signature) {
      console.log("❌ Signature mismatch in manual verification");
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // 2️⃣ Find appointment for this order
    const appointment = await prisma.appointment.findFirst({
      where: { paymentId: orderId },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // 3️⃣ If already confirmed (hook may have done it), return safely
    if (appointment.status === "CONFIRMED") {
      return res.json({ success: true, alreadyConfirmed: true });
    }

    // 4️⃣ Update appointment status → CONFIRMED
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: "CONFIRMED" },
    });

    // 5️⃣ Mark slot as booked
    if (appointment.slotId) {
      try {
        await prisma.slot.update({
          where: { id: appointment.slotId },
          data: { isBooked: true },
        });
      } catch (err) {
        // slot may already be booked → ignore
      }
    }

    console.log("✅ Appointment CONFIRMED via verify API:", appointment.id);

    return res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (err) {
    console.error("❌ verifyPaymentHandler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
