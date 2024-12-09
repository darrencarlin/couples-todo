import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { token: string } }
) => {
  const session = await auth();
  const { token } = params;

  if (!session?.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the verification record matching the provided token
    const t = await prisma.inviteToken.findFirst({
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

    // Update the invitee's significant other ID to the current user's ID
    const { id } = await prisma.user.update({
      where: { email: t.invitee },
      data: { significantOtherId: session?.user.id },
    });

    // Update the current user's significant other ID to the invitee's ID
    await prisma.user.update({
      where: { email: session?.user.email },
      data: { significantOtherId: id },
    });

    // Delete the used invite token
    await prisma.inviteToken.delete({
      where: { identifier_token: { identifier: t.identifier, token: t.token } },
    });

    // Return success message
    return NextResponse.json({
      success: true,
      message: "Invite verified successfully",
    });
  } catch (error) {
    // Log and return any errors that occur during the process
    console.error("Error verifying token:", error);
    return NextResponse.json({
      success: false,
      message:
        "An error occurred while verifying the token, try refreshing the page",
    });
  }
};
