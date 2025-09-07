import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

export const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_ACCESS_SECRET!,
  },
});

const bucket = {
  async upload(file: File, path?: string) {
    const arrayBuffer = await file.arrayBuffer();
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: path || file.name,
        Body: Buffer.from(arrayBuffer),
        ContentType: file.type,
      })
    );
  },
};

export default bucket;
