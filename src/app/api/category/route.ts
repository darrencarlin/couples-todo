import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getErrorMessage } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const session = await auth();

  const body = await request.json();

  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await prisma.planCategory.create({
      data: {
        name: body.category,
        userId: session.user.id,
        icon: body.icon,
        color: body.color,
        significantOtherId: session.user.significantOtherId ?? "",
      },
    });

    revalidatePath("/plan/new");

    return NextResponse.json({ succes: true, data });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error), success: false });
  }
};
