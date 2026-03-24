import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import r2 from "@/lib/r2";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await r2.send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME!,
      })
    );

    return NextResponse.json({
      success: true,
      message: "Connexion R2 OK",
      objects: result.Contents ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}