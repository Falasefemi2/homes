"use server";

import { db } from "@/db/drizzle";
import { Home } from "@/db/schema";
import { generateReactHelpers } from "@uploadthing/react";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { OurFileRouter } from "./api/uploadthing/core";


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


const { uploadFiles } = generateReactHelpers<OurFileRouter>();

export async function createDescription(formData: FormData) {


    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = formData.get('price')
    const imageFile = formData.get('image') as File

    const guestsNumbers = formData.get("guests") as string
    const roomNumbers = formData.get("rooms") as string
    const bedroomsNumbers = formData.get("bedrooms") as string

    try {
        // Upload the image
        const uploadResponse = await uploadFiles({
            endpoint: "imageUpload",
            files: [imageFile],
        });

        if (uploadResponse && uploadResponse[0]) {
            const imageUrl = uploadResponse[0].url;

            // Now you can use the imageUrl along with other form data
            // to create your description or save to database
            console.log("Image uploaded successfully:", imageUrl);

            // Your logic to save the description with the image URL
            // For example:
            // await saveDescriptionToDatabase({
            //   title,
            //   description,
            //   price,
            //   imageUrl,
            //   guestsNumbers,
            //   roomNumbers,
            //   bedroomsNumbers,
            // });

        } else {
            throw new Error("Image upload failed");
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        // Handle the error appropriately
    }
}