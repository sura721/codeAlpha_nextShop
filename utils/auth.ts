import { auth } from "@clerk/nextjs/server";
import prisma from '@/lib/prisma';

export async function isAdmin(): Promise<boolean> {
    const { userId } = await auth();
    if (!userId) return false;

    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { admin: true }
    });

    if (user?.admin === true) return true;
    return false;
}
