import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Support MinIO via explicit S3_* envs, with AWS_* fallback.
const endpoint =
  process.env.S3_ENDPOINT ||
  process.env.MINIO_ENDPOINT ||
  process.env.AWS_S3_ENDPOINT ||
  undefined;

const region =
  process.env.S3_REGION ||
  process.env.AWS_REGION ||
  // MinIO is region-agnostic; default to us-east-1 for compatibility
  "us-east-1";

const accessKeyId =
  process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey =
  process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || "";

const forcePathStyle =
  (process.env.S3_FORCE_PATH_STYLE || "").toLowerCase() === "true" ||
  Boolean(endpoint); // MinIO typically needs path-style

const s3 = new S3Client({
  region,
  endpoint,
  forcePathStyle,
  credentials:
    accessKeyId && secretAccessKey
      ? { accessKeyId, secretAccessKey }
      : undefined,
});

export async function uploadFile(
  bucket: string,
  key: string,
  body: Buffer,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await s3.send(command);

  // Prefer a public base URL for clients (browser-accessible), fallback to endpoint.
  const publicBase =
    process.env.S3_PUBLIC_URL?.replace(/\/$/, "") || endpoint?.replace(/\/$/, "");
  if (publicBase) {
    // Path-style URL for MinIO and when forcePathStyle
    const safeKey = encodeURIComponent(key).replace(/%2F/g, "/");
    return `${publicBase}/${bucket}/${safeKey}`;
  }
  // Fallback to AWS virtual-hosted style
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
