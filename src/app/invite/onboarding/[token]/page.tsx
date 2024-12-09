import { Heading } from "@/components/heading";
import { Main } from "@/components/main";
import { GoogleIcon } from "@/components/svg-icons/google-icon";
import { Text } from "@/components/text";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";

export default async function OnboardingPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;

  return (
    <Main>
      <Heading as="h1">Welcome to Plan.SO</Heading>
      <Text>You have been invited to join Plan.SO. Login to get started.</Text>

      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: `/invite/${token}` });
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
