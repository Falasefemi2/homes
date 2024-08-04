"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export function Counter({ name }: { name: string }) {
    const [amount, setAmount] = useState(0);

    function increase() {
        setAmount((prev) => prev + 1);
    }

    function decrease() {
        if (amount > 0) {
            setAmount((prev) => prev - 1);
        }
    }

    return (
        <div className="flex items-center justify-center sm:justify-end gap-x-4">
            <input type="hidden" name={name} value={amount} />
            <Button variant="outline" size="sm" type="button" onClick={decrease}>
                <Minus className="h-4 w-4 text-primary" />
            </Button>
            <p className="font-medium text-lg w-8 text-center">{amount}</p>
            <Button variant="outline" size="sm" type="button" onClick={increase}>
                <Plus className="h-4 w-4 text-primary" />
            </Button>
        </div>
    )
}