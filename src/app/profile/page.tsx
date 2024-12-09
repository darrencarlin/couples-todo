import { SignificantOtherForm } from "@/components/forms/significant-other-form";
import { Main } from "@/components/main";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await auth();

  if (!session?.user.id) {
    return redirect("/sign-in");
  }

  return (
    <Main>
      <div className="mb-8">
        <p>Profile</p>
        <p>Email: {session.user.email}</p>
      </div>
      <SignificantOtherForm />
    </Main>
  );
}
