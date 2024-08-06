"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCountires } from "@/lib/getCountries";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";



export default function AddressRoute() {
    const { getAllCountires } = useCountires()
    const [locationValue, setLocationValue] = useState("");

    const LazyMap = dynamic(() => import("@/app/_components/Map"), {
        ssr: false,
        loading: () => <Skeleton className="h-[50vh] w-full" />,
    });
    return (
        <>
            <div className="w-3/5 mx-auto">
                <h2 className="text-3xl font-semibold tracking-tight transition-colors mb-10">Where is your Home located?</h2>
            </div>

            <form action="">
                <div className="w-3/5 mx-auto">
                    <div className="mb-5">
                        <Select required>
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
                    </div>

                    <LazyMap locationValue={locationValue} />

                </div>
            </form>
        </>
    )
}