import { AutoHeightContainer } from "@/components/auto-height-container";
import { Breadcrumb } from "@/components/breadcrumb";
import { Main } from "@/components/main";
import { NewCollectionForm } from "@/components/new-collection-form";

export default async function Page() {
  return (
    <Main>
      <AutoHeightContainer>
        <Breadcrumb page={["/", "todo", "new"]} />
        <NewCollectionForm />
      </AutoHeightContainer>
    </Main>
  );
}
