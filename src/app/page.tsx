import { Main } from "@/components/main";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <Main>
      <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
    </Main>
  );
}
