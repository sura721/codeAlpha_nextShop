import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } =await auth();
  if (!userId) throw new Error("Unauthorized: No user ID found.");
  
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user?.admin) throw new Error("Unauthorized: Admin access required.");
  
  return { userId: user.id, userEmail: user.email };
};

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => await handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      
      return { uploadedBy: metadata.userEmail };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;