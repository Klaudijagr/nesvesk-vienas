/**
 * Face Verification API Route
 *
 * POST /api/face-verify
 * Accepts FormData with two images (image1, image2) and returns verification result.
 *
 * Note: This is a placeholder that validates the request format.
 * Actual face verification should be done client-side using the useFaceVerification hook
 * since face-api.js works best in the browser with canvas support.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProvided = (
  entry: FormDataEntryValue | null
): entry is FormDataEntryValue => entry !== null && entry !== "";

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const image1 = formData.get("image1");
    const image2 = formData.get("image2");

    if (!(isProvided(image1) && isProvided(image2))) {
      return NextResponse.json(
        {
          error: "Both image1 and image2 are required",
          details: {
            image1: isProvided(image1) ? "provided" : "missing",
            image2: isProvided(image2) ? "provided" : "missing",
          },
        },
        { status: 400 }
      );
    }

    // Validate file types
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!(image1 instanceof File && allowedTypes.has(image1.type))) {
      return NextResponse.json(
        { error: "image1 must be a JPEG, PNG, or WebP image" },
        { status: 400 }
      );
    }
    if (!(image2 instanceof File && allowedTypes.has(image2.type))) {
      return NextResponse.json(
        { error: "image2 must be a JPEG, PNG, or WebP image" },
        { status: 400 }
      );
    }

    // Validate file sizes (max 10MB each)
    const maxSize = 10 * 1024 * 1024;
    if (image1.size > maxSize) {
      return NextResponse.json(
        { error: "image1 exceeds maximum size of 10MB" },
        { status: 400 }
      );
    }
    if (image2.size > maxSize) {
      return NextResponse.json(
        { error: "image2 exceeds maximum size of 10MB" },
        { status: 400 }
      );
    }

    // Return instruction to use client-side verification
    // Server-side face-api.js requires additional setup with tfjs-node and canvas
    return NextResponse.json({
      message:
        "Images validated successfully. Use client-side verification for face matching.",
      status: "validated",
      images: {
        image1: { name: image1.name, size: image1.size, type: image1.type },
        image2: { name: image2.name, size: image2.size, type: image2.type },
      },
      instructions:
        "Use the useFaceVerification hook for client-side face matching",
    });
  } catch (error) {
    console.error("Face verification error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
};

export const GET = () =>
  NextResponse.json({
    service: "Face Verification API",
    version: "1.0.0",
    library: "@vladmandic/face-api",
    endpoints: {
      "POST /api/face-verify":
        "Upload two images (image1, image2) for verification",
    },
    note: "Face verification is performed client-side using the useFaceVerification hook",
  });
