import { z } from "zod";

export const wellnessCaseSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters long"),
  robotId: z.string().trim().min(1, "Robot selection is required"),
  scenarioContext: z.string().trim().min(1, "Scenario context is required"),
  activityDesc: z.string().trim().min(10, "Activity description must be at least 10 characters long"),
  stressScore: z.coerce.number().int().min(1, "Stress score must be between 1 and 5").max(5, "Stress score must be between 1 and 5"),
  comfortScore: z.coerce.number().int().min(1, "Comfort score must be between 1 and 5").max(5, "Comfort score must be between 1 and 5"),
  trustScore: z.coerce.number().int().min(1, "Trust score must be between 1 and 5").max(5, "Trust score must be between 1 and 5"),
  usefulnessScore: z.coerce.number().int().min(1, "Usefulness score must be between 1 and 5").max(5, "Usefulness score must be between 1 and 5"),
  caveats: z.string().trim().optional().nullable(),
  evidenceUrl: z.string().trim().url("Evidence URL must be a valid http or https URL"),
  submittedBy: z.string().trim().optional().nullable()
});

export type WellnessCaseInput = z.infer<typeof wellnessCaseSchema>;
