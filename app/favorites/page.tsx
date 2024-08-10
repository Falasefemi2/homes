import { db } from "@/db/drizzle"
import { Favorite, Home } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

async function getData(userId: string) {
    unstable_noStore();

    const data = await db
        .select({
            Home: {
                photo: Home.photo,
                id: Home.id,
                Favorite: sql<any>`json_agg(${Favorite})`,
                price: Home.price,
                country: Home.country,
                description: Home.description,
            },
        })
        .from(Favorite)
        .innerJoin(Home, eq(Favorite.homeId, Home.id))
        .where(eq(Favorite.userId, userId))
        .groupBy(Home.id);

    return data;
}

export default async function FavoriteRoute() {
    const user = auth()
    if (!user) return redirect("/")
    const data = await getData(user.userId as string)

    return (
        <div className="container mx-auto py-5 lg:px-10 mt-10">
            <h2>Your Favorites</h2>
        </div>
    )
}