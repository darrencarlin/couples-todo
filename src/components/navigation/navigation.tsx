import { auth } from "@/lib/auth";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Logout } from "./log-out";

export const Navigation = async () => {
  const session = await auth();
  return (
    <nav className="flex justify-between items-center px-3 py-3 bg-zinc-200">
      <div className="flex gap-2">
        <Link href="/plans" className="font-medium underline">
          Plans
        </Link>

        <Link href="/plan/new" className="font-medium underline">
          New Plan
        </Link>
      </div>
      <div>
        {!session && (
          <Link href="/sign-in" className="font-medium underline">
            Log In
          </Link>
        )}
        {session && (
          <div className="flex gap-2">
            <Link href="/profile" className="font-medium underline">
              Profile
            </Link>
            <Logout />
          </div>
        )}
      </div>
    </nav>
  );
};
