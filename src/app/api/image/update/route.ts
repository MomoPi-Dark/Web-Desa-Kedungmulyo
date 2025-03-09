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

// Function to update an image in Cloudinary and support folder upload
export async function PUT(request: Request): Promise<Response> {
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
    let fileName = file.name;
    const publicId = `${Date.now()}-${fileName.split(".")}`;
    const folder = formData.get("folder") || "webdesa";

    const result = (await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          folder: folder.toString(),
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      uploadStream.end(fileBuffer);
    })) as any;

    return NextResponse.json(
      { message: "Image uploaded/updated successfully.", ...result },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in Cloudinary upload:", error);
    return NextResponse.json(
      { error: "Failed to upload/update the image." },
      { status: 500 },
    );
  }
}
