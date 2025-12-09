import { z } from "zod";

export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export const SleepQualityEnum = z.enum([
  "NORMAL",
  "IRREGULAR",
  "DISTURBED",
  "INSOMNIA",
]);
export const BowelMovementEnum = z.enum([
  "NORMAL",
  "CONSTIPATION",
  "DIARRHEA",
  "IRREGULAR",
]);

export const FoodPreference = z.enum(["VEG", "NON_VEG", "EGG_VEG"]);

export const createPatientSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .refine((val) => val.length <= 100, {
      message: "Name exceeds maximum length of 100 characters",
    }),

  phone: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number seems too long")
    .refine((val) => val.length <= 15, {
      message: "Phone number exceeds maximum length of 15 characters",
    }),

  gender: GenderEnum,

  email: z
    .string()
    .email("Enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .refine((val) => val.length <= 255, {
      message: "Email exceeds maximum length of 255 characters",
    }),

  dateOfBirth: z
    .string()
    .max(50, "Date of birth string exceeds maximum length")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date format"),

  age: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((num) => !isNaN(num), { message: "Age must be a number" })
    .refine((num) => num >= 0 && num <= 120, {
      message: "Age must be between 0 and 120",
    }),

  address: z
    .string()
    .min(5, "Address is too short")
    .max(500, "Address must be less than 500 characters")
    .refine((val) => val.length <= 500, {
      message: "Address exceeds maximum length of 500 characters",
    }),

  weight: z
    .union([z.string(), z.number()])
    .transform(Number)
    .refine((n) => !isNaN(n) && n > 0, "Weight must be positive"),

  height: z
    .union([z.string(), z.number()])
    .transform(Number)
    .refine((n) => !isNaN(n) && n > 0, "Height must be positive"),

  // Optional basic measurements
  neck: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine((n) => n === undefined || n > 0, "Neck must be positive"),

  waist: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine((n) => n === undefined || n > 0, "Waist must be positive"),

  hip: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine((n) => n === undefined || n > 0, "Hip must be positive"),

  // Optional detailed measurements (for weight loss plan)
  chest: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine((n) => n === undefined || n > 0, "Chest must be positive"),

  chestFemale: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine((n) => n === undefined || n > 0, "Chest female must be positive"),

  normalChestLung: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine(
      (n) => n === undefined || n > 0,
      "Normal chest lung must be positive"
    ),

  expandedChestLungs: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine(
      (n) => n === undefined || n > 0,
      "Expanded chest lungs must be positive"
    ),

  arms: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine((n) => n === undefined || n > 0, "Arms must be positive"),

  forearms: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine((n) => n === undefined || n > 0, "Forearms must be positive"),

  wrist: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine((n) => n === undefined || n > 0, "Wrist must be positive"),

  abdomenUpper: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine((n) => n === undefined || n > 0, "Abdomen upper must be positive"),

  abdomenLower: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine((n) => n === undefined || n > 0, "Abdomen lower must be positive"),

  thighUpper: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine((n) => n === undefined || n > 0, "Thigh upper must be positive"),

  thighLower: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine((n) => n === undefined || n > 0, "Thigh lower must be positive"),

  calf: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine((n) => n === undefined || n > 0, "Calf must be positive"),

  ankle: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .optional()
    .refine((n) => n === undefined || n > 0, "Ankle must be positive"),

  medicalHistory: z
    .string()
    .max(5000, "Medical history must be less than 5000 characters")
    .optional()
    .refine((val) => !val || val.length <= 5000, {
      message: "Medical history exceeds maximum length of 5000 characters",
    }),
  fileIds: z
    .array(z.string().uuid())
    .max(50, "Maximum 50 files allowed")
    .optional(),
  appointmentConcerns: z
    .string()
    .max(1000, "Appointment concerns must be less than 1000 characters")
    .optional()
    .refine((val) => !val || val.length <= 1000, {
      message: "Appointment concerns exceeds maximum length of 1000 characters",
    }),

  bowelMovement: BowelMovementEnum,
  foodPreference: FoodPreference,

  allergic: z
    .string()
    .max(500, "Allergic information must be less than 500 characters")
    .optional()
    .refine((val) => !val || val.length <= 500, {
      message: "Allergic information exceeds maximum length of 500 characters",
    }),

  dailyFoodIntake: z
    .string()
    .max(2000, "Daily food intake must be less than 2000 characters")
    .optional()
    .refine((val) => !val || val.length <= 2000, {
      message: "Daily food intake exceeds maximum length of 2000 characters",
    }),

  dailyWaterIntake: z
    .union([z.string(), z.number()])
    .transform(Number)
    .refine((n) => !isNaN(n) && n >= 0, "Water intake must be a number"),

  wakeUpTime: z
    .string()
    .min(2, "Invalid wakeup time")
    .max(20, "Wakeup time exceeds maximum length")
    .refine((val) => val.length <= 20, {
      message: "Wakeup time exceeds maximum length of 20 characters",
    }),
  sleepTime: z
    .string()
    .min(2, "Invalid sleep time")
    .max(20, "Sleep time exceeds maximum length")
    .refine((val) => val.length <= 20, {
      message: "Sleep time exceeds maximum length of 20 characters",
    }),

  sleepQuality: SleepQualityEnum,
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
