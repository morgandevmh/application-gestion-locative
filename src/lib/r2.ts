import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo en octets

// upload
export async function uploadFile(
    file: Buffer,
    folder: string,
    contentType: string
  ) {
    // vérifier le type 
    if (!ALLOWED_TYPES.includes(contentType)) {
      throw new Error(`Type de fichier non autorisé : ${contentType}`);
    }
  
    // vérifier la taille
    if (file.length > MAX_SIZE) {
      throw new Error(`Fichier trop volumineux (max ${MAX_SIZE / 1024 / 1024} Mo)`);
    }
  
    const extension = contentType.split("/")[1]; // "pdf", "jpeg", "png"
    const fileName = `${randomUUID()}.${extension}`;
    const key = `${folder}/${fileName}`;
  
    //envoyer vers R2
    await r2.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file,
        ContentType: contentType,
      })
    );
  
    return key;
  }

  // delete 
  export async function deleteFile(key: string) {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );
  }

  // url presigné
  export async function getFileUrl(key: string, expiresIn = 3600) {
    const url = await getSignedUrl(
      r2,
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
      }),
      { expiresIn }
    );
  
    return url;
  }