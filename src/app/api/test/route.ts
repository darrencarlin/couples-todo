import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async () => {
  const session = await auth();

  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // const { id: planCategoryId } = await prisma.planCategory.create({
    //   data: {
    //     userId: session?.user.id,
    //     name: "Basketball on Saturday",
    //     color: "#50aeeb",
    //     icon: "Volleyball",
    //   },
    //   select: {
    //     id: true,
    //   },
    // });
    // const { id: todoCategoryId } = await prisma.todoCategory.create({
    //   data: {
    //     userId: session?.user.id,
    //     name: "todoCategory 1",
    //     color: "#50aeeb",
    //     icon: "Popcorn",
    //   },
    //   select: {
    //     id: true,
    //   },
    // });

    // const { id: planId } = await prisma.plan.create({
    //   data: {
    //     userId: session?.user.id,
    //     name: "Basketball on Saturday",
    //     date: new Date(),
    //     metadata: `{"key": "value"}`,
    //     categoryId: planCategoryId,
    //   },
    //   select: {
    //     id: true,
    //   },
    // });
    // const { id: todoId } = await prisma.todo.create({
    //   data: {
    //     userId: session?.user.id,
    //     name: "Silo",
    //     metadata: `{"key": "value"}`,
    //     categoryId: todoCategoryId,
    //     status: "ACTIVE",
    //   },
    //   select: {
    //     id: true,
    //   },
    // });

    const data = await prisma.user.findFirst({
      where: {
        id: session?.user.id,
      },
      include: {
        plans: {
          include: {
            category: true,
          },
        },
        todos: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
  }
};
