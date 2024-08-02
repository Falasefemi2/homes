"use server";

import { db } from "@/db/drizzle";
import { Home } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";


export async function createAirbnbHome({ userId }: { userId: string }) {
    // First, try to find an existing home for the user
    const existingHomes = await db.select()
        .from(Home)
        .where(eq(Home.userId, userId))
        .limit(1);

    let homeId: string;
    let addedCategory: boolean;
    let addedDescription: boolean;
    let addedLocation: boolean;

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

        homeId = newHome.id;
        addedCategory = false;
        addedDescription = false;
        addedLocation = false;
    } else {
        // If a home exists, use its values
        const existingHome = existingHomes[0];
        homeId = existingHome.id;
        addedCategory = existingHome.addedCategory;
        addedDescription = existingHome.addedDescription;
        addedLocation = existingHome.addedLocation;
    }

    if (!addedCategory) {
        // If category is not added, redirect to structure page
        return redirect(`/create/${homeId}/structure`);
    } else if (addedCategory && !addedDescription) {
        // If category is added but description is not, redirect to description page
        return redirect(`/create/${homeId}/description`);
    } else if (addedCategory && addedDescription && !addedLocation) {
        // If category and description are added but location is not, redirect to location page
        return redirect(`/create/${homeId}/location`);
    } else {
        // All steps are complete, redirect to a different page (e.g., the home details page)
        return redirect(`/homes/${homeId}`);
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