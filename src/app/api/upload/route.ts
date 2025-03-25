import { ensureBucketExists, minioClient } from "@/minio/MinioClient";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { selectedFile, postId } = await req.json();

    if (!selectedFile || !postId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await ensureBucketExists("posts"); // Ensure MinIO bucket exists

    const fileName = `${postId}-${uuidv4()}.png`; // Generate unique filename
    const fileBuffer = Buffer.from(selectedFile.split(",")[1], "base64"); // Convert Base64 to Buffer
    const fileSize = fileBuffer.length; // Get the file size

    // Upload to MinIO
    await minioClient.putObject("posts", fileName, fileBuffer, fileSize, {
      "Content-Type": "image/png",
    });

    // Generate public MinIO URL
    const imageURL = `${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}:${process.env.NEXT_PUBLIC_MINIO_PORT}/posts/${fileName}`;

    return NextResponse.json({ imageURL }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
