/* eslint-disable @next/next/no-img-element */

import { db } from "@/db/drizzle";
import { Home, Reservation, User } from "@/db/schema";
import { useCountires } from "@/lib/getCountries";
import { eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import { Separator } from "@/components/ui/separator"
import { CaegoryShowcase } from "@/app/_components/CategoryShowCase";
import { HomeMap } from "@/app/_components/HomeMap";
import { SelectCalender } from "@/app/_components/SelectCalender";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { ReservationSubmitButton } from "@/app/_components/SubmitButton";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { createReservation } from "@/app/actions";


async function getData(homeid: string) {
    noStore();
    const result = await db.select({
        photo: Home.photo,
        description: Home.description,
        guests: Home.guests,
        bedrooms: Home.bedrooms,
        bathrooms: Home.bathrooms,
        title: Home.title,
        categoryName: Home.categoryName,
        price: Home.price,
        country: Home.country,
        Reservation: Reservation,
        User: {
            profileImage: User.profileImageUrl,
            firstName: User.firstName,
            createdAt: User.createdAt,
        },
    })
        .from(Home)
        .leftJoin(Reservation, eq(Reservation.homeId, Home.id))
        .leftJoin(User, eq(User.id, Home.userId))
        .where(eq(Home.id, homeid));

    // Since findUnique returns a single object, we'll return the first (and only) result
    return result[0] || null;
}
export default async function HomeRoute({ params }: { params: { id: string } }) {
    const data = await getData(params.id)
    const { getCountryByValue } = useCountires()
    const country = getCountryByValue(data?.country as string)
    const user = auth()
    console.log(data);

    return (
        <div className="w-full px-4 md:w-[75%] mx-auto mt-10 mb-12">
            <h1 className="font-medium text-2xl mb-5">{data?.title}</h1>
            <div className="relative h-[300px] md:h-[550px]">
                <Image src={data?.photo} alt="image" fill className="rounded-lg h-full object-cover w-full" />
            </div>
            <div className="flex flex-col md:flex-row justify-between md:gap-x-24 mt-8">
                <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-medium">
                        {country?.flag} {country?.label} / {country?.region}
                    </h3>
                    <div className="flex gap-x-2 text-muted-foreground">
                        <p>{data?.guests} Guests</p> * <p>{data?.bathrooms} Bathrooms</p> * <p>{data?.bedrooms} Bedrooms</p>
                    </div>

                    <div className="flex items-center mt-6">
                        <img
                            src={data?.User?.profileImage ?? "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"}
                            alt="img"
                            className="w-11 h-11 rounded-full"
                        />
                        <div className="flex flex-col ml-4">
                            <h3 className="font-medium">Hosted by {data?.User?.firstName}</h3>
                            <p>Host since {data?.User?.createdAt ? data.User.createdAt.toDateString() : 'N/A'}</p>
                        </div>
                    </div>

                    <Separator className="my-7" />

                    <CaegoryShowcase categoryName={data?.categoryName as string} />

                    <Separator className="my-7" />

                    <p className="text-muted-foreground">{data?.description}</p>

                    <Separator className="my-7" />

                    <HomeMap locationValue={country?.value as string} />
                </div>

                <div className="w-full md:w-1/3 mt-8 md:mt-0">
                    <form action={createReservation}>
                        <input type="hidden" name="homeId" value={params.id} />
                        <input type="hidden" name="userId" value={user.userId as string} />
                        <SelectCalender
                            reservation={data?.Reservation ? [{ startDate: data.Reservation.startDate, endDate: data.Reservation.endDate }] : undefined}
                        />
                        {user?.userId ? (
                            <ReservationSubmitButton />
                        ) : (
                            <Button className="w-full" asChild>
                                <Link href="/sign-in">Make a Reservation</Link>
                            </Button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}