import { db } from "@/db/drizzle"
import { Favorite, Home } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import { NoItems } from "../_components/NoItems";
import { ListingCard } from "../_components/ListingCard";

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
        <div className="container mx-auto px-5 lg:px-10 mt-10">
            <h2 className="text-3xl font-semibold tracking-tight">Your Favorites</h2>
            {data.length === 0 ? (
                <NoItems
                    title="Hey you dont have any favorites"
                    description="Please add favorites to see them right here..."
                />
            ) : (
                <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">

                    {data.map((item) => (
                        <ListingCard
                            key={item.Home.id}
                            description={item.Home.description as string}
                            location={item.Home.country as string}
                            pathName="/favorites"
                            homeId={item.Home.id}
                            imagePath={item.Home.photo as string}
                            price={item.Home.price as number}
                            userId={user.userId as string}
                            favoriteId={item.Home?.Favorite[0].id as string}
                            isInfavoriteList={Boolean(item.Home?.Favorite[0])}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}