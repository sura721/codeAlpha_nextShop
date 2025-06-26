import { Inngest } from "inngest";
import  prisma  from "@/lib/prisma";
export const inngest = new Inngest({ id: "nextShop" });




// creating addUser function

export const syncUserOnCreate = inngest.createFunction(
  { id: "sync-user-on-create", name: "Sync User on Create" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    const { clerkId, email, name } = event.data;

    const user = await step.run("sync-user-to-db", async () => {
      return await prisma.user.upsert({
        where: { clerkId: clerkId },
        update: {
          email: email,
          name: name,
        },
        create: {
          clerkId: clerkId,
          email: email,
          name: name,
        },
      });
    });

    return {
      message: `User synced successfully`,
      userId: user.id,
    };
  }
);