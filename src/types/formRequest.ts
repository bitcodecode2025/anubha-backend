import { FormDataInput } from "./formData";

export interface FileInput {
  url: string;
  fileName: string;
  mimeType: string;
  sizeInBytes: number;
}

export interface SlotTime {
  startTime: string;
  endTime: string;
}

export interface CreateUserFormBody {
  userName: string;
  phone: string;
  slotId: string;
  slotTime: SlotTime;
  formData: FormDataInput;
  files?: FileInput[];
}
