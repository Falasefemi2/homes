"use server";

import { db } from "@/db/drizzle";
import { Home } from "@/db/schema";
import { generateReactHelpers } from "@uploadthing/react/hooks";
// import type { OurFileRouter } from "./core";

import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { UploadThingError } from "uploadthing/server";
import type { OurFileRouter } from "./api/uploadthing/core";
const { uploadFiles } = generateReactHelpers<OurFileRouter>();



export async function createAirbnbHome({ userId }: { userId: string }) {
    // Find the most recently created home for the user
    const existingHomes = await db.select()
        .from(Home)
        .where(eq(Home.userId, userId))
        .orderBy(desc(Home.createdAt))
        .limit(1);

    if (existingHomes.length === 0) {
        // If no home exists, create a new one
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
        // Update the home with the category information
        const [updatedHome] = await db
            .update(Home)
            .set({
                title: categoryName,  // Assuming you want to set the title as the category name
                addedCategory: true
            })
            .where(eq(Home.id, homeId))
            .returning();

        if (!updatedHome) {
            throw new Error('Home not found');
        }

        // Redirect to the description page
        return redirect(`/create/${homeId}/description`);
    } catch (error) {
        console.error('Error updating home:', error);
        // Handle the error appropriately (e.g., show an error message to the user)
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
        // Upload the image using uploadthings
        // const uploadResponse = await uploadFiles("imageUploader", {
        //     files: [imageFile],
        // });

        // if (!uploadResponse || !uploadResponse[0]) {
        //     throw new Error("Image upload failed");
        // }

        // const imageUrl = uploadResponse[0].url;
        const uploadResponse = await uploadFiles("imageUpload", {
            files: [imageFile],
        });
        console.log("Upload response:", uploadResponse);

        if (!uploadResponse || !uploadResponse[0]) {
            throw new Error("Image upload failed");
        }

        const imageUrl = uploadResponse[0].url;
        console.log("Image uploaded successfully:", imageUrl);


        // Update the home in the database using Drizzle ORM
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
        // Handle the error appropriately
        throw error; // or return an error response
    }

}