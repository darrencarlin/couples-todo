import { signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export const Logout = () => {
  return (
    <form
      className="flex items-center"
      action={async () => {
        "use server";
        await signOut();
        redirect("/");
      }}
    >
      <button type="submit" className="font-medium underline">
        Log Out
      </button>
    </form>
  );
};
