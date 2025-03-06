import { z } from "zod";

export const testSchema = z.object({
  patientName: z.string().min(3, "Name must be at least 3 characters"),
  testType: z.string().min(1, "Test type is required"),
  result: z.string().min(1, "Result is required"),
  patientId: z.string().min(1, "id is required"),
  notes: z.string().optional(),
});
