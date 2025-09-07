import { z } from "zod";

export const QuoteFormSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" })
      .max(100, { message: "Name cannot be longer than 100 characters." }),
    brand: z
      .string()
      .min(3, { message: "Brand must be at least 3 characters long" })
      .max(100, { message: "Brand cannot be longer than 100 characters." }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(5, { message: "Email must be at least 5 characters long" })
      .max(150, { message: "Email cannot be longer than 150 characters." }),
    quantity: z
      .int({ message: "Invalid quantity" })
      .min(1, { message: "Quantity must be at least 1" }),
    deadline: z
      .date({ message: "Invalid date" })
      .min(new Date(), { message: "Deadline must be in the future" })
      .optional(),
    garment: z
      .string()
      .min(3, { message: "Garment type must be at least 3 characters long" })
      .max(100, {
        message: "Garment type cannot be longer than 100 characters.",
      }),
    blank: z
      .string()
      .min(3, { message: "Blank must be at least 3 characters long" })
      .max(100, { message: "Blank cannot be longer than 100 characters." }),
    colors: z
      .array(
        z
          .string()
          .min(3, { message: "Each color must be at least 3 characters long" })
          .max(30, {
            message: "Each color cannot be longer than 30 characters.",
          }),
        { error: "At least one color is required" }
      )
      .min(1, { message: "At least one color is required" })
      .max(6, { message: "No more than 6 colors are allowed" }),
    printLocation: z
      .string()
      .min(3, { message: "Print location must be at least 3 characters long" })
      .max(100, {
        message: "Print location cannot be longer than 100 characters.",
      }),
    mockupChoice: z.boolean(),
    mockup: z
      .array(z.instanceof(File))
      .nonempty("Please select a file")
      .length(1, "Only one file can be uploaded")
      .refine(
        (files) => files.every((file) => file.size <= 50 * 1024 * 1024),
        "File size should be less than 50MB"
      )
      .refine(
        (files) =>
          files.every((file) =>
            ["image/jpeg", "image/png", "application/pdf"].includes(file.type)
          ),
        "Only JPG, PNG, and PDF files are accepted"
      ),
  })
  .superRefine((data, ctx) => {
    if (!data.mockupChoice) {
      ctx.issues = ctx.issues.filter(
        (issue) => !(issue.path && issue.path[0] === "mockup")
      );
    }
  });
