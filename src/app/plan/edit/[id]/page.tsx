import { Main } from "@/components/main";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

const getPlan = async (planId: string) => {
  const session = await auth();

  if (!session?.user.id) {
    return redirect("/sign-in");
  }

  const data = await prisma.plan.findFirst({
    where: {
      userId: session.user.id,
      id: planId,
    },
    include: {
      category: true,
    },
  });

  return data;
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const plan = await getPlan(id);
  return <Main>Edit Plan: {plan?.name}</Main>;
}
