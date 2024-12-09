"use client";

import { Heading } from "@/components/heading";
import { Main } from "@/components/main";
import { Text } from "@/components/text";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/utils";
import { ResponseType } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const { token } = params;

  const handleAcceptInvite = async () => {
    const { success, message } = await fetchApi<ResponseType>(
      "/api/verify/invite/" + token
    );

    setSuccess(success);
    setMessage(message);

    if (success) {
      router.push("/");
    }
  };

  if (!success) {
    return (
      <Main>
        <Heading as="h1">Error</Heading>
        <Text>{message}</Text>
      </Main>
    );
  }

  return (
    <Main>
      <Button onClick={handleAcceptInvite}>Accept Invite</Button>
    </Main>
  );
}
