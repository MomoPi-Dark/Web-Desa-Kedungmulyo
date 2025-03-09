import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Function to upload a file to Cloudinary and support folder upload with file extension handling
export async function POST(request: Request): Promise<Response> {
  try {
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary configuration is missing." },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Invalid file in the request body." },
        { status: 400 },
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Extract file extension
    const fileName = file.name;
    const public_id = `${Date.now()}-${fileName.split(".")[0]}`;
    const folder = formData.get("folder") || "webdesa";

    const result = (await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: public_id,
          folder: folder.toString(),
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      uploadStream.end(fileBuffer);
    })) as any;

    return NextResponse.json(
      { message: "File uploaded successfully.", ...result },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in Cloudinary upload:", error);
    return NextResponse.json(
      { error: "Failed to upload the file." },
      { status: 500 },
    );
  }
}
