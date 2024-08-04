import CreationButtonBar from "@/app/_components/CreateBottomBar";
import { SelectCategory } from "@/app/_components/SelectCategory";
import { createCategoryPage } from "@/app/actions";
export default function StructureRoute({ params }: { params: { id: string } }) {
    return (
        <>
            <div className="w-3/5 mx-auto">
                <h2 className="text-3xl font-semibold tracking-tight transition-colors">
                    Which of this best describe your Home?
                </h2>
            </div>

            <form action={createCategoryPage}>
                <input type="hidden" name="homeId" value={params.id} />
                <SelectCategory />
                <CreationButtonBar />
            </form>
        </>
    )
}