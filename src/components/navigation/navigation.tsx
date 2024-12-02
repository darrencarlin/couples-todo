import { auth } from "@/lib/auth";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Logout } from "./log-out";

export const Navigation = async () => {
  const session = await auth();
  return (
    <nav className="flex justify-between items-center px-3 py-3 bg-zinc-200">
      <div className="flex gap-1">
        <Link href="/plans" className="text-xs underline">
          Plans
        </Link>
        <Link href="/todos" className="text-xs underline">
          Todos
        </Link>
      </div>
      <div>
        {!session && (
          <Link href="/sign-in">
            <LogIn className="w-5 h-5" />
          </Link>
        )}
        {session && <Logout />}
      </div>
    </nav>
  );
};
