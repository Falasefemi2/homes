/** @format */

import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  profilePicture: f(["image"])
    .middleware(({ req }) => auth())
    .onUploadComplete((data) => console.log("file", data)),

  messageAttachment: f(["image", "video"])
    .middleware(({ req }) => auth())
    .onUploadComplete((data) => console.log("file", data)),

  strictImageAttachment: f({
    image: { maxFileSize: "2MB", maxFileCount: 1, minFileCount: 1 },
  })
    .middleware(({ req }) => auth())
    .onUploadComplete((data) => console.log("file", data)),

  mediaPost: f({
    image: { maxFileSize: "2MB", maxFileCount: 4 },
    video: { maxFileSize: "256MB", maxFileCount: 1 },
  })
    .middleware(({ req }) => auth())
    .onUploadComplete((data) => console.log("file", data)),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
