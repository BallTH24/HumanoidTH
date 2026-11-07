import { z } from "zod";

export const validSubmissionTypes = [
  "source_url",
  "robot_model",
  "owned_inventory_update",
  "contribution_claim",
  "event_demo_record",
  "correction_request"
] as const;

export const submissionSchema = z.object({
  submissionType: z.enum(validSubmissionTypes, {
    errorMap: () => ({ message: "Invalid submission type." })
  }),
  title: z
    .string({ required_error: "Title is required." })
    .trim()
    .min(3, "Title must be at least 3 characters long.")
    .max(250, "Title cannot exceed 250 characters."),
  url: z
    .string()
    .trim()
    .url("URL must be a valid web link.")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(5000, "Notes cannot exceed 5000 characters.")
    .optional()
    .or(z.literal("")),
  submitterName: z
    .string()
    .trim()
    .max(120, "Submitter name cannot exceed 120 characters.")
    .optional()
    .nullable(),
  submitterContact: z
    .string()
    .trim()
    .email("Submitter contact must be a valid email address.")
    .optional()
    .nullable()
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
