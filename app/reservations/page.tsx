import { db } from "@/db/drizzle"
import { Favorite, Home, Reservation } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import { NoItems } from "../_components/NoItems";
import { ListingCard } from "../_components/ListingCard";

async function getData(userId: string) {
    unstable_noStore();

    const data = await db
        .select({
            id: Home.id,
            country: Home.country,
            photo: Home.photo,
            description: Home.description,
            price: Home.price,
            favorite: {
                id: Favorite.id,
                userId: Favorite.userId
            }
        })
        .from(Reservation)
        .leftJoin(Home, eq(Reservation.homeId, Home.id))
        .leftJoin(Favorite, and(
            eq(Favorite.homeId, Home.id),
            eq(Favorite.userId, userId)
        ))
        .where(eq(Reservation.userId, userId));

    return data;
}

export default async function ReservationRoute() {
    const user = auth()
    if (!user) return redirect("/")
    const data = await getData(user.userId as string)

    return (
        <div className="container mx-atuo px-5 lg:px-10 mt-10">
            <h2 className="text-3xl font-semibold tracking-tight">Your Reservations</h2>
            {data.length === 0 ? (
                <NoItems
                    title="Hey you dont have any reservations"
                    description="Please add reservations to see them right here..."
                />
            ) : (
                <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">

                    {data.map((item) => (
                        <ListingCard
                            key={item?.id}
                            description={item.description as string}
                            location={item.country as string}
                            pathName="/favorites"
                            homeId={item?.id as string}
                            imagePath={item.photo as string}
                            price={item.price as number}
                            userId={user.userId as string}
                            favoriteId={item?.favorite?.id as string}
                            isInfavoriteList={Boolean(item?.favorite)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}