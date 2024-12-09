import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  console.log("Verifying token:", token);

  try {
    // Find the verification record matching the provided token
    const t = await prisma.verificationToken.findFirst({
      where: { token },
    });

    // If no matching token is found, return an error
    if (!t) {
      return NextResponse.json({
        success: false,
        message: "Invalid token",
      });
    }

    // Check if the token has expired
    if (t.expires < new Date()) {
      // Handle expired token logic here if needed
    }

    // Token is valid, update the user's verified status
    await prisma.user.update({
      where: { email: t.identifier },
      data: { emailVerified: new Date() },
    });

    // Delete the used verification token
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: t.identifier, token: t.token } },
    });

    // Return success message
    return NextResponse.json({
      success: true,
      message: "User verified successfully",
    });
  } catch (error) {
    // Log and return any errors that occur during the process
    console.error("Error verifying token:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while verifying the token",
    });
  }
}
