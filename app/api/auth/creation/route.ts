/** @format */

import db from "@/db/drizzle";
import { User } from "@/db/schema";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const clerkUser = await clerkClient.users.getUser(userId);

    // Create user in your database
    const newUser = await db
      .insert(User)
      .values({
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        profileImageUrl: clerkUser.imageUrl,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
      })
      .returning();

    // return res.status(200).json(newUser[0]);
    return NextResponse.redirect("http://localhost:3000");
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
