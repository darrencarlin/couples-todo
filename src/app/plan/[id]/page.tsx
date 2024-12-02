import { Main } from "@/components/main";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const getPlan = async (planId: string) => {
  const session = await auth();

  if (!session?.user.id) {
    return redirect("/sign-in");
  }

  const data = await prisma?.plan.findFirst({
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
  return (
    <Main>
      <p>Plan: {plan?.name}</p>
      <Link className="underline text-blue-500" href={`/plan/edit/${id}`}>
        Edit Plan
      </Link>
    </Main>
  );
}
