import { NextResponse } from "next/server";
import { minioClient } from "@/minio/MinioClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { selectedFile, communityId } = await req.json();
    if (!selectedFile || !communityId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert Base64 to Buffer
    const base64Data = selectedFile.split(",")[1]; // Extract base64 data
    const fileBuffer = Buffer.from(base64Data, "base64");

    const fileName = `${communityId}-${uuidv4()}.png`; // Generate unique filename

    // Upload image to MinIO (fix: move content-type to the correct parameter)
    await minioClient.putObject("communities", fileName, fileBuffer, fileBuffer.length, {
      "Content-Type": "image/png", 
    });

    // Construct the MinIO URL
    const imageURL = `${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}:${process.env.NEXT_PUBLIC_MINIO_PORT}/communities/${fileName}`;

    return NextResponse.json({ imageURL }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
