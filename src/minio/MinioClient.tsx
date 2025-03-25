import { Client } from "minio";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Helper function to get required env variables safely
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

// Parse environment variables with validation
const minioConfig = {
  endPoint: getEnv("NEXT_PUBLIC_MINIO_ENDPOINT"),
  port: parseInt(getEnv("NEXT_PUBLIC_MINIO_PORT", "9000"), 10),
  useSSL: getEnv("NEXT_PUBLIC_MINIO_USE_SSL", "false").toLowerCase() === "true",
  accessKey: getEnv("NEXT_PUBLIC_MINIO_ACCESS_KEY"),
  secretKey: getEnv("NEXT_PUBLIC_MINIO_SECRET_KEY"),
};

// Initialize MinIO client
const minioClient = new Client(minioConfig);

// Function to check if a bucket exists, if not, create it
const ensureBucketExists = async (bucketName: string) => {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, "us-east-1");
      console.log(`Bucket ${bucketName} created successfully.`);
    }
  } catch (error) {
    console.error("Error checking/creating bucket:", error);
  }
};


export { minioClient, ensureBucketExists };


// docker command for minio
// $ docker run -p 9000:9000 -p 9001:9001 -e "MINIO_ROOT_USER=admin" -e "MINIO_ROOT_PASSWORD=admin123" minio/minio server /data --console-address ":9001"

