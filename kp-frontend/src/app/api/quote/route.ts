import { NextResponse } from "next/server";
import { Client, QueryResult } from "pg";
import { nanoid } from "nanoid";
import { customAlphabet } from "nanoid";
import bucket from "@/utils/s3";
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

  const db = new Client({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT) || 5432,
  });

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

    const hash = `quote-assets/${nanoid(48)}`;
    const mockupFile = formData.get("mockup") as File | null;
    let fileName = "";

    let mockup: QueryResult<any> = { rows: [{ id: null }] } as QueryResult<any>;
    if (mockupFile) {
      // Upload mockup file to S3
      fileName = `${hash}.${mockupFile.name.split(".").pop()}`;
      await bucket.upload(mockupFile, fileName);
      // Add file to the database
      await db.connect();
      const now = new Date();
      mockup = await db.query(
        `INSERT INTO files(document_id, name, hash, ext, mime, size, url, provider, folder_path, created_at, updated_at, published_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id`,
        [
          customAlphabet(
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            24
          )(),
          mockupFile ? mockupFile.name : "",
          hash,
          fileName.split(".").pop() ? `.${fileName.split(".").pop()}` : "",
          mockupFile ? mockupFile.type : "",
          mockupFile ? mockupFile.size / 1024 : null,
          `${process.env.S3_PUBLIC_URL}/${fileName}`,
          "aws-s3",
          "/2",
          now,
          now,
          now,
        ]
      );
    }

    // Insert quote data into the Strapi
    const { success, message } = await api.post(
      "/quotes",
      {
        data: {
          ...data,
          colors: data.colors.join(", "),
          mockup: mockupFile && mockup.rows[0].id ? mockup.rows[0].id : null,
        },
      },
      {},
      process.env.API_WRITE_TOKEN
    );

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: message || "Failed to submit form",
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
  } finally {
    await db.end();
  }
};
