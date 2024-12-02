import { Main } from "@/components/main";
import { GoogleIcon } from "@/components/svg-icons/google-icon";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";

export default function Page() {
  return (
    <Main>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <Button
          className="flex w-fit p-2"
          size="icon"
          type="submit"
          aria-label="Signin with Google"
        >
          Google <GoogleIcon />
        </Button>
      </form>
    </Main>
  );
}
