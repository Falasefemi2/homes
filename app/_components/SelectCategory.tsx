"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { categoryItems } from "@/lib/CategoryItems";
import Image from "next/image";
import { useState } from "react";

export function SelectCategory() {
    const [selectCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-10 w-full sm:w-4/5 md:w-3/5 mx-auto mb-12 sm:mb-24 md:mb-36 px-4 sm:px-0">
            <input type="hidden" name="categoryName" value={selectCategory as string} />
            {categoryItems.map((item) => (
                <div key={item.id} className="cursor-pointer">
                    <Card
                        className={`${selectCategory === item.name ? "border-primary" : ""} h-full`}
                        onClick={() => setSelectedCategory(item.name)}
                    >
                        <CardHeader className="flex flex-col items-center text-center p-3 sm:p-4">
                            <Image
                                src={item.imageUrl}
                                alt={item.name}
                                height={32}
                                width={32}
                                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mb-2"
                            />
                            <h3 className="font-medium text-sm sm:text-base">{item.title}</h3>
                        </CardHeader>
                    </Card>
                </div>
            ))}
        </div>
    )
}