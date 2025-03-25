import { minioClient } from "@/minio/MinioClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageURL } = await req.json();
    if (!imageURL) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // Extract the file name from the URL
    const fileName = imageURL.split("/").pop();
    if (!fileName) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }

    // Delete image from MinIO
    await minioClient.removeObject("posts", fileName);

    return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
