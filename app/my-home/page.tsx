import { db } from "@/db/drizzle"
import { Favorite, Home } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { NoItems } from "../_components/NoItems";
import { ListingCard } from "../_components/ListingCard";


async function getData(userId: string) {
    noStore();
    const data = await db.select({
        id: Home.id,
        country: Home.country,
        photo: Home.photo,
        description: Home.description,
        price: Home.price,
        Favorite: Favorite
    })
        .from(Home)
        .leftJoin(Favorite, and(
            eq(Favorite.homeId, Home.id),
            eq(Favorite.userId, userId)
        ))
        .where(and(
            eq(Home.userId, userId),
            eq(Home.addedCategory, true),
            eq(Home.addedDescription, true),
            eq(Home.addedLocation, true)
        ))
        .orderBy(desc(Home.createdAt));


    return data;
}
export default async function MyHomes() {
    const user = auth()
    if (!user) return redirect("/")
    const data = await getData(user.userId as string)

    return (
        <section className="container mx-auto px-5 lg:px-10 mt-10">
            <h2 className="text-3xl font-semibold tracking-tight">Your Homes</h2>
            {data.length === 0 ? (
                <NoItems
                    title="Hey you dont have any favorites"
                    description="Please add favorites to see them right here..."
                />
            ) : (
                <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">

                    {data.map((item) => (
                        <ListingCard
                            key={item.id}
                            imagePath={item.photo as string}
                            homeId={item.id}
                            price={item.price as number}
                            description={item.description as string}
                            location={item.country as string}
                            userId={user.userId as string}
                            pathName="/my-home"
                            favoriteId={item.Favorite?.id as string}
                            isInfavoriteList={Boolean(item.Favorite)}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}