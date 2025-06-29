// File: app/api/uploadthing/core.ts

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { isAdmin } from "@/utils/auth";

const f = createUploadthing();

const handleAuth = () => {
  const admin = isAdmin();
  if (!admin) throw new Error("Unauthorized: Admin access required.");
  return { isAdmin: true };
};

export const ourFileRouter = {
  productImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for admin:", metadata.isAdmin);
     
      console.log("File details:", file.name, file.size);

      return { uploadedBy: "admin" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;