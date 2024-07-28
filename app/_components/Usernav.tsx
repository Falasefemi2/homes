import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'

import { MenuIcon } from "lucide-react";

export default function UserNav() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
                    <MenuIcon className="w-6 h-6 lg:w-5 lg:h-5" />

                    <img src="https://www.freepik.com/free-vector/illustration-businessman_2606517.htm#query=default%20user&position=0&from_view=keyword&track=ais_user&uuid=1b1e53d9-d328-4707-b8fb-580b17d714b8" alt="image of the user" className="rounded h-8 w-8 hidden lg:block" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem>
                    <SignUpButton>
                        Register
                    </SignUpButton>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <SignInButton>
                        Login
                    </SignInButton>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

