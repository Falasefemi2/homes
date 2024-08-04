"use server";

import { db } from "@/db/drizzle";
import { Home } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

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