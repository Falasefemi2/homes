import { db } from "@/db/drizzle";
import { MapFilterItems } from "./_components/MapFilterItem";
import { unstable_noStore as noStore } from "next/cache";
import { and, eq } from "drizzle-orm";
import { Favorite, Home } from "@/db/schema";
import { ListingCard } from "./_components/ListingCard";
import { Suspense } from "react";
import { SkeletonCard } from "./_components/SkeletonCard";
import { NoItems } from "./_components/NoItems";
import { auth } from "@clerk/nextjs/server";



async function getData(
  {
    searchParams,
    userId,
  }: {
    userId: string | undefined;
    searchParams?: {
      filter?: string;
      country?: string;
      guest?: string;
      room?: string;
      bathroom?: string;
    };
  }) {
  noStore();


  const query = db
    .select({
      photo: Home.photo,
      id: Home.id,
      price: Home.price,
      description: Home.description,
      country: Home.country,
      Favorite: Favorite
    })
    .from(Home)
    .leftJoin(Favorite, and(
      eq(Favorite.homeId, Home.id),
      userId ? eq(Favorite.userId, userId) : undefined
    ))
    .where(and(
      eq(Home.addedCategory, true),
      eq(Home.addedLocation, true),
      eq(Home.addedDescription, true),
      searchParams?.filter ? eq(Home.categoryName, searchParams.filter) : undefined,
      searchParams?.country ? eq(Home.country, searchParams.country) : undefined,
      searchParams?.guest ? eq(Home.guests, searchParams.guest) : undefined,
      searchParams?.room ? eq(Home.bedrooms, searchParams.room) : undefined,
      searchParams?.bathroom ? eq(Home.bathrooms, searchParams.bathroom) : undefined
    ));

  const data = await query;
  return data;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: {
    filter?: string;
  };
}) {

  return (
    <main className="container mx-auto px-5 lg:px-10">
      <MapFilterItems />
      <Suspense key={searchParams?.filter} fallback={<SkeletonLoading />}>
        <ShowItem searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function ShowItem({
  searchParams,
}: {
  searchParams?: {
    filter?: string;
  };
}) {
  const user = auth()
  const data = await getData({ searchParams: searchParams, userId: user?.userId! })
  console.log(data);


  return (
    <>
      {data.length === 0 ? (
        <NoItems description="Please check a other category or create your own listing!"
          title="Sorry no listings found for this category..."
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {data.map((item) => (
            <ListingCard
              key={item.id}
              description={item.description as string}
              imagePath={item.photo as string}
              location={item.country as string}
              price={item.price as number}
              userId={user.userId as string}
              // favoriteId={item.Favorite?.id}
              favoriteId={item.Favorite?.id ?? ''}
              // isInfavoriteList={item.Favorite !== null}
              isInfavoriteList={Boolean(item.Favorite)}
              homeId={item.id}
              pathName="/"
            />
          ))}
        </div>
      )}
    </>
  )
}

function SkeletonLoading() {
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}

