import { Main } from "@/components/main";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <Main>
      {session ? (
        <pre>
          <code>{JSON.stringify(session, null, 2)}</code>
        </pre>
      ) : (
        <div>Not logged in</div>
      )}
    </Main>
  );
}
