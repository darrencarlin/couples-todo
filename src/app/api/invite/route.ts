import { APP_NAME } from "@/constants";
import { SignificantOtherEmail } from "@/emails/so-invite";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { resend } from "@/lib/resend";
import { getErrorMessage } from "@/lib/utils";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const session = await auth();

  const { email } = await request.json();

  if (!session?.user.id || !session?.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Create a verification token
    const token = nanoid();

    await prisma.inviteToken.create({
      data: {
        invitee: session.user.email,
        identifier: email,
        token: token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });

    // Send verification email
    const { error: emailError } = await resend.emails.send({
      from: `${APP_NAME} <${process.env.RESEND_EMAIL_ADDRESS}>`,
      to: email,
      subject: "You've been invited to join Plan.SO",
      react: SignificantOtherEmail({
        name: session.user?.name ?? "Your SO",
        token: token,
      }),
    });

    // Log any errors
    if (emailError) {
      console.error("Error sending email:", emailError);
      return NextResponse.json({
        error: "Error sending email",
        success: false,
      });
    }

    return NextResponse.json({ succes: true, data: "" });
  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error),
      success: false,
    });
  }
};
