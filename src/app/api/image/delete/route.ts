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

// Function to delete an image from Cloudinary (supporting folders)
export async function DELETE(request: Request): Promise<Response> {
  try {
    // Validate environment variables
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Missing required environment variables." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json(
        { error: "Missing 'publicId' in the request body." },
        { status: 400 },
      );
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });

    if (result.result === "ok") {
      return NextResponse.json(
        { message: "Image deleted successfully.", ...result },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: "Failed to delete the image. Check the 'publicId'." },
        { status: 400 },
      );
    }
  } catch (error) {
    // Log the error details to identify the issue
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the image." },
      { status: 500 },
    );
  }
}
