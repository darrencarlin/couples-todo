import { Button } from "@react-email/button";
import { Font } from "@react-email/font";
import { Head } from "@react-email/head";
import { Heading } from "@react-email/heading";
import { Html } from "@react-email/html";
import { Text } from "@react-email/text";

import * as React from "react";

interface Props {
  name: string;
  token: string;
}

export const SignificantOtherEmail = async ({ name, token }: Props) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Heading as="h1">{name} has invited you!</Heading>
      <Text>
        Click the link below to accept the invitation and start using our
        service.
      </Text>
      <Button
        href={
          process.env.NODE_ENV === "development"
            ? `http://localhost:3000/invite/onboarding/${token}`
            : `${process.env.BASE_URL}/invite/onboarding/${token}`
        }
      >
        Accept Invitation
      </Button>
    </Html>
  );
};
