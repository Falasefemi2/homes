import { Counter } from "@/app/_components/Counter";
import CreationButtonBar from "@/app/_components/CreateBottomBar";
import { createDescription } from "@/app/actions";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DescriptionPage({ params }: { params: { id: string } }) {
    return (
        <>
            <div className="w-3/5 mx-auto">
                <h2 className="text-3xl font-semibold tracking-tighter transition-colors">Please describe your home as good as you can</h2>
            </div>

            <form action={createDescription}>
                <input type="hidden" name="homeId" value={params.id} />
                <div className="mx-auto w-3/5 mt-10 flex flex-col gap-y-5 mb-36">
                    <div className="flex flex-col gap-y-2">
                        <Label>Title</Label>
                        <Input name="title" type="text" required placeholder="Short and simple..." />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Description</Label>
                        <Textarea name="description" required placeholder="Please describe your home..." />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Price</Label>
                        <Input name="price" required type="number" placeholder="Price per night in USD" min={10} />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Image</Label>
                        <Input name="image" required type="file" />
                    </div>
                    <Card className="w-full">
                        <CardHeader className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="mb-4 sm:mb-0">
                                    <h3 className="text-lg font-medium underline">Guests</h3>
                                    <p className="text-sm text-muted-foreground">How many guests do you want?</p>
                                </div>
                                <Counter name="guests" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="mb-4 sm:mb-0">
                                    <h3 className="text-lg font-medium underline">Rooms</h3>
                                    <p className="text-sm text-muted-foreground">How many rooms do you have?</p>
                                </div>
                                <Counter name="rooms" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="mb-4 sm:mb-0">
                                    <h3 className="text-lg font-medium underline">Bathrooms</h3>
                                    <p className="text-sm text-muted-foreground">How many bathrooms do you have?</p>
                                </div>
                                <Counter name="bedrooms" />
                            </div>
                        </CardHeader>
                    </Card>
                </div>
                <CreationButtonBar />
            </form>
        </>
    )
}