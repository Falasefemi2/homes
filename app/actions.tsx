"use server";

import { db } from "@/db/drizzle";
import { Favorite, Home } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { utapi } from "./server/uploadthing";
import { revalidatePath } from "next/cache";


export async function createAirbnbHome({ userId }: { userId: string }) {
    const existingHomes = await db.select()
        .from(Home)
        .where(eq(Home.userId, userId))
        .orderBy(desc(Home.createdAt))
        .limit(1);

    if (existingHomes.length === 0) {
        const [newHome] = await db.insert(Home)
            .values({
                userId: userId,
                title: '',
                description: '',
                guests: '',
                bedrooms: '',
                bathrooms: '',
                country: '',
                photo: '',
                price: 0,
                categoryName: "",
                addedCategory: false,
                addedDescription: false,
                addedLocation: false

            })
            .returning();

        return redirect(`/create/${newHome.id}/structure`);
    } else {
        const existingHome = existingHomes[0];

        if (!existingHome.addedCategory && !existingHome.addedDescription && !existingHome.addedLocation) {
            return redirect(`/create/${existingHome.id}/structure`);
        } else if (existingHome.addedCategory && !existingHome.addedDescription) {
            return redirect(`/create/${existingHome.id}/description`);
        } else if (existingHome.addedCategory && existingHome.addedDescription && !existingHome.addedLocation) {
            return redirect(`/create/${existingHome.id}/address`);
        } else if (existingHome.addedCategory && existingHome.addedDescription && existingHome.addedLocation) {
            // Create a new home if all steps are completed
            const [newHome] = await db.insert(Home)
                .values({
                    userId: userId,
                    title: '',
                    description: '',
                    guests: '',
                    bedrooms: '',
                    bathrooms: '',
                    country: '',
                    photo: '',
                    price: 0,
                    categoryName: "",
                    addedCategory: false,
                    addedDescription: false,
                    addedLocation: false
                })
                .returning();

            return redirect(`/create/${newHome.id}/structure`);
        }
    }
}


export async function createCategoryPage(formData: FormData) {
    const categoryName = formData.get('categoryName') as string;
    const homeId = formData.get('homeId') as string;

    if (!categoryName || !homeId) {
        throw new Error('Category name and home ID are required');
    }

    try {
        const [updatedHome] = await db
            .update(Home)
            .set({
                categoryName: categoryName,
                addedCategory: true
            })
            .where(eq(Home.id, homeId))
            .returning();

        if (!updatedHome) {
            throw new Error('Home not found');
        }
        return redirect(`/create/${homeId}/description`);
    } catch (error) {
        console.error('Error updating home:', error);
        throw error;
    }
}

export async function createDescription(formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = formData.get('price')
    const imageFile = formData.get('image') as File
    const homeId = formData.get('homeId') as string

    const guestsNumbers = formData.get("guests") as string
    const roomNumbers = formData.get("rooms") as string
    const bedroomsNumbers = formData.get("bedrooms") as string

    try {

        const uploadResult = await utapi.uploadFiles(imageFile);

        if (!uploadResult || uploadResult.error) {
            throw new Error(`Failed to upload image: ${uploadResult?.error?.message || 'Unknown error'}`);
        }

        if (!uploadResult.data) {
            throw new Error("Failed to upload image: No data returned");
        }

        const imageUrl = uploadResult.data.url;
        if (!imageUrl) {
            throw new Error("Failed to upload image: No URL returned");
        }

        const updatedHome = await db.update(Home)
            .set({
                title: title,
                description: description,
                price: Number(price),
                bedrooms: bedroomsNumbers,
                bathrooms: roomNumbers,
                guests: guestsNumbers,
                photo: imageUrl,
                addedDescription: true,
            })
            .where(eq(Home.id, homeId))
            .returning();

        if (!updatedHome || updatedHome.length === 0) {
            throw new Error("Failed to update home");
        }

        return redirect(`/create/${homeId}/address`);
    } catch (error) {
        console.error("Error in CreateDescription:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        throw error;
    }

}


export async function createLocation(formData: FormData) {
    const homeId = formData.get('homeId') as string;
    const countryValue = formData.get('countryValue') as string;

    const [updatedHome] = await db.update(Home).set({
        addedLocation: true,
        country: countryValue,
    })
        .where(eq(Home.id, homeId))
        .returning();

    return redirect('/')
}


export async function addToFavorite(formData: FormData) {
    const homeId = formData.get("homeId") as string;
    const userId = formData.get("userId") as string;
    const pathName = formData.get("pathName") as string;

    const [data] = await db.insert(Favorite).values({
        homeId: homeId,
        userId: userId,
    }).returning();

    revalidatePath(pathName);

    return data;
}

export async function DeleteFromFavorite(formData: FormData) {
    const favoriteId = formData.get("favoriteId") as string;
    const pathName = formData.get("pathName") as string;
    const userId = formData.get("userId") as string;

    const [deletedData] = await db
        .delete(Favorite)
        .where(
            and(
                eq(Favorite.id, favoriteId),
                eq(Favorite.userId, userId)
            )
        )
        .returning();

    revalidatePath(pathName);

    return deletedData;
}