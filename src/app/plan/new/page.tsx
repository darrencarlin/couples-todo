import { NewPlanForm } from "@/components/forms/new-plan-form";
import { Main } from "@/components/main";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const getPlanCategories = async () => {
  const session = await auth();

  if (!session?.user.id) {
    return redirect("/sign-in");
  }

  const data = await prisma?.planCategory.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return data || [];
};

export default async function PlansCreate() {
  const categories = await getPlanCategories();

  return (
    <Main>
      <NewPlanForm categories={categories} />
    </Main>
  );
}
