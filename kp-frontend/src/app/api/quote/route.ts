import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { QuoteFormSchema } from "@/schema/quote-form";
import z from "zod";
import { api } from "@/utils/api";

export const config = {
  api: {
    bodyParser: false,
  },
};

const schema = z
  .object({
    ...QuoteFormSchema.shape,
    mockup: z
      .instanceof(File)
      .optional()
      .refine(
        (file) => !file || file.size <= 50 * 1024 * 1024,
        "File size should be less than 50MB"
      )
      .refine(
        (file) =>
          !file ||
          ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
        "Only JPG, PNG, and PDF files are accepted"
      ),
  })
  .omit({ mockupChoice: true });

export const POST = async (req: Request) => {

  try {
    const formData = await req.formData();
    const data: z.infer<typeof schema> = {
      name: formData.get("name") as string,
      brand: formData.get("brand") as string,
      email: formData.get("email") as string,
      quantity: Number(formData.get("quantity") as string),
      deadline: formData.get("deadline")
        ? new Date(formData.get("deadline") as string)
        : undefined,
      garment: formData.get("garment") as string,
      blank: formData.get("blank") as string,
      colors: formData.getAll("colors") as string[],
      printLocation: formData.get("printLocation") as string,
      mockup: formData.get("mockup")
        ? (formData.get("mockup") as File)
        : undefined,
    };

    const { success: zSuccess, error: zError } = schema.safeParse(data);

    if (!zSuccess || zError) {
      return NextResponse.json(
        {
          success: false,
          message: zError.issues[0].message || "Invalid form data",
        },
        { status: 400 }
      );
    }

    const mockupFile = formData.get("mockup") as File | null;
    let mockupId: number | null = null;

    // Uploading File
    if (mockupFile) {
      const file = new FormData();
      file.append("files", mockupFile);

      console.log(file)

      const { success, data, message } = await api.post<[{ id: number }]>('/upload', file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }, process.env.API_WRITE_TOKEN);

      if (!success || !data || !data[0]?.id) {
        return NextResponse.json(
          {
            success: false,
            message: message || "Failed to upload file",
          },
          { status: 500 }
        );
      }
      mockupId = data[0].id;
    }

    // Insert quote into the Strapi
    const { success } = await api.post(
      "/quotes",
      {
        data: {
          ...data,
          colors: data.colors.join(", "),
          mockup: mockupFile && mockupId,
        },
      },
      {},
      process.env.API_WRITE_TOKEN
    );

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to submit form",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully!",
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
};
