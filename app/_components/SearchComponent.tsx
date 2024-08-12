"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCountires } from "@/lib/getCountries";
import { HomeMap } from "./HomeMap";
import { Button } from "@/components/ui/button";
import { CreationSubmit } from "./SubmitButton";
import { Card, CardHeader } from "@/components/ui/card";
import { Counter } from "./Counter";


export function SearchModel() {
    const { getAllCountires } = useCountires()
    const [step, setStep] = useState(1);
    const [locationValue, setLocationValue] = useState("");

    function SubmitButtonLocal() {
        if (step === 1) {
            return (
                <Button onClick={() => setStep(step + 1)} type="button">
                    Next
                </Button>
            );
        } else if (step === 2) {
            return <CreationSubmit />;
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="rounded-full py-2 px-5 border flex items-center cursor-pointer">
                    <div className="flex h-full divide-x font-medium">
                        <p className="px-4">AnyWhere</p>
                        <p className="px-4">AnyWeek</p>
                        <p className="px-4">Add Guests</p>
                    </div>

                    <SearchIcon className="bg-primary text-white p-1 h-8 w-8 rounded-full" />
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <form className="flex flex-col gap-4">
                    <input type="hidden" name="country" value={locationValue} />
                    {step === 1 ? (
                        <>
                            <DialogHeader>
                                <DialogTitle>Select a Country</DialogTitle>
                                <DialogDescription>Please Choose a Country</DialogDescription>
                                <Select required onValueChange={(value) => setLocationValue(value)} value={locationValue}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a Country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Countries</SelectLabel>
                                            {getAllCountires().map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.flag} {item.label} / {item.region}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <HomeMap locationValue={locationValue} />
                            </DialogHeader>
                        </>
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle>Select all the info you need</DialogTitle>
                                <DialogDescription>
                                    Please Choose a Country, so that what you want
                                </DialogDescription>
                            </DialogHeader>

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

                        </>
                    )}

                    <DialogFooter>
                        <SubmitButtonLocal />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}