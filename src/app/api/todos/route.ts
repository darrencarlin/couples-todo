import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await auth();

  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({ succes: true });
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
    return NextResponse.json({ succes: true });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error), success: false });
  }
};
