import { z } from "zod";

export const SignificantOtherSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateSignificantOtherSchema = SignificantOtherSchema.omit({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateSignificantOtherSchema = SignificantOtherSchema.extend({
  id: z.string().min(1, { message: "ID is required for update" }),
});

export type SignificantOtherFormData = z.infer<
  typeof CreateSignificantOtherSchema
>;

export type SignificantOtherUpdateData = z.infer<
  typeof UpdateSignificantOtherSchema
>;

// Base Zod schema for Plan
export const PlanSchema = z.object({
  id: z.string().optional(), // Optional for create, required for update
  name: z.string().min(1, { message: "Name is required" }),
  date: z.date(),
  metadata: z.record(z.unknown()).optional(), // JSON can be any record of unknown values
  userId: z.string().nullish(), // Nullable string for optional user relation
  categoryId: z.string().nullish(), // Nullable string for optional category relation
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Schema for creating a new Plan (might omit some fields)
export const CreatePlanSchema = PlanSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for updating an existing Plan (requires ID)
export const UpdatePlanSchema = PlanSchema.extend({
  id: z.string().min(1, { message: "ID is required for update" }),
});

export type PlanFormData = z.infer<typeof CreatePlanSchema>;
export type PlanUpdateData = z.infer<typeof UpdatePlanSchema>;

export const PlanCategorySchema = z.object({
  id: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().min(1, "Please select an icon"),
  category: z.string().min(1, { message: "Category is required" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreatePlanCategorySchema = PlanCategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdatePlanCategorySchema = PlanCategorySchema.extend({
  id: z.string().min(1, { message: "ID is required for update" }),
});

export type PlanCategoryFormData = z.infer<typeof CreatePlanCategorySchema>;
export type PlanCategoryUpdateData = z.infer<typeof UpdatePlanCategorySchema>;
