/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import db from "@/db/drizzle";
import { User } from "@/db/schema";
import {
    SignInButton,
    SignOutButton,
    SignUpButton,
} from '@clerk/nextjs'
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";

import { MenuIcon } from "lucide-react";

// export async function UserNav() {
//     const user = await currentUser()

//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger>
//                 <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
//                     <MenuIcon className="w-6 h-6 lg:w-5 lg:h-5" />
//                     <img src={user?.imageUrl ?? "https://www.freepik.com/free-vector/illustration-businessman_2606517.htm#query=default%20user&position=0&from_view=keyword&track=ais_user&uuid=1b1e53d9-d328-4707-b8fb-580b17d714b8"} alt="img" className="rounded-full h-8 w-8 hidden lg:block" />
//                 </div>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-[200px]">
//                 {user ? (
//                     <DropdownMenuItem className="p-0">
//                         <Button variant="outline" className="w-full px-2 py-1.5 text-left">
//                             <SignOutButton>
//                                 Logout
//                             </SignOutButton>
//                         </Button>
//                     </DropdownMenuItem>
//                 ) : (
//                     <>
//                         <DropdownMenuItem className="p-0">
//                             <Button variant="outline" className="w-full px-2 py-1.5 text-left">
//                                 <SignUpButton>
//                                     Register
//                                 </SignUpButton>
//                             </Button>
//                         </DropdownMenuItem>
//                         <DropdownMenuItem className="p-0">
//                             <Button variant="outline" className="w-full px-2 py-1.5 text-left">
//                                 <SignInButton>
//                                     Login
//                                 </SignInButton>
//                             </Button>
//                         </DropdownMenuItem>
//                     </>
//                 )}
//             </DropdownMenuContent>
//         </DropdownMenu>
//     )
// }

export async function UserNav() {
    const { userId } = auth();
    const user = await currentUser();
    if (user && userId) {
        try {
            const newUser = await db.insert(User).values({
                id: userId,
                email: user.emailAddresses[0]?.emailAddress || "", // Use the first email address
                profileImageUrl: user.imageUrl || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                createdAt: new Date(),
                updatedAt: new Date(),
            })
                .onConflictDoUpdate({
                    target: User.id,
                    set: {
                        email: sql`${user.emailAddresses[0]?.emailAddress}`,
                        profileImageUrl: sql`${user.imageUrl}`,
                        firstName: sql`${user.firstName}`,
                        lastName: sql`${user.lastName}`,
                        updatedAt: sql`CURRENT_TIMESTAMP`,
                    },
                })
                .returning();

            console.log("User created or updated:", newUser[0]);
        } catch (error) {
            console.error("Error creating user in database:", error);
        }
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
                    <MenuIcon className="w-6 h-6 lg:w-5 lg:h-5" />
                    <img src={user?.imageUrl ?? "https://www.freepik.com/free-vector/illustration-businessman_2606517.htm#query=default%20user&position=0&from_view=keyword&track=ais_user&uuid=1b1e53d9-d328-4707-b8fb-580b17d714b8"} alt="img" className="rounded-full h-8 w-8 hidden lg:block" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                {user ? (
                    <DropdownMenuItem className="p-0">
                        <Button variant="outline" className="w-full px-2 py-1.5 text-left">
                            <SignOutButton>
                                Logout
                            </SignOutButton>
                        </Button>
                    </DropdownMenuItem>
                ) : (
                    <>
                        <DropdownMenuItem className="p-0">
                            <Button variant="outline" className="w-full px-2 py-1.5 text-left">
                                <SignUpButton>
                                    Register
                                </SignUpButton>
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-0">
                            <Button variant="outline" className="w-full px-2 py-1.5 text-left">
                                <SignInButton>
                                    Login
                                </SignInButton>
                            </Button>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

