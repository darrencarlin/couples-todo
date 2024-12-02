import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, response: NextResponse) => {
  const session = await auth();

  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await prisma?.plan.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ data, succes: true });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error), success: false });
  }
};

export const POST = async (request: Request) => {
  const session = await auth();

  const body = await request.json();

  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await prisma?.plan.create({
      data: {
        ...body,
        metadata: JSON.stringify(body.metadata),
        userId: session.user.id,
      },
    });

    return NextResponse.json({ succes: true, data });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error), success: false });
  }
};
