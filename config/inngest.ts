import { Inngest } from "inngest";
import  prisma  from "@/lib/prisma";
export const inngest = new Inngest({ id: "nextShop" });



// creating addUser function
export const syncUserOnCreate = inngest.createFunction(
  { id: "sync-user-on-create", name: "Sync User on Create" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    const clerkId = event.data.id;
    const email = event.data.email_addresses?.[0]?.email_address ?? "";
    const name = event.data.first_name ?? "";

    const user = await step.run("sync-user-to-db", async () => {
      return await prisma.user.upsert({
        where: { clerkId },
        update: { email, name },
        create: { clerkId, email, name },
      });
    });

    return {
      message: "User synced successfully",
      userId: user.id,
    };
  }
);


// user deletetion




export const deleteUserOnClerkDelete = inngest.createFunction(
  { id: "delete-user-on-clerk-delete", name: "Delete User on Clerk Delete" },
  { event: "clerk/user.deleted" },
  async ({ event, step }) => {
    const { clerkId } = event.data;

    const deletedUser = await step.run("delete-user-from-db", async () => {
      const result = await prisma.user.deleteMany({
        where: {
          clerkId: clerkId,
        },
      });
      return result;
    });

    if (deletedUser.count === 0) {
      return { message: "User not found in DB, nothing to delete." };
    }

    return { message: `User with Clerk ID ${clerkId} deleted successfully.` };
  }
);