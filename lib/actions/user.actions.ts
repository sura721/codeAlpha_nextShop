'use server'
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * @returns {Promise<boolean>} 
 */
export const checkIsAdmin = async (): Promise<boolean> => {
  try {

    const {userId} = await auth()
    if (!userId) {
      return false;
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        admin: true,
      },
    });

    return user?.admin ?? false;
  } catch (error) {
    console.error("Failed to check admin status:", error);
    return false;
  }
};

export async function toggleUserAdminStatus(userId: string) {
  const { userId: currentClerkId } = await auth();
  const userToModify = await prisma.user.findUnique({ where: { id: userId } });

  if (!userToModify) {
    throw new Error('User not found.');
  }

  if (userToModify.clerkId === currentClerkId) {
    return { success: false, message: "You cannot change your own admin status." };
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        admin: !userToModify.admin, // Invert the current admin status
      },
    });

    revalidatePath('/admin/users');
    return { success: true, message: 'User role updated successfully.' };
  } catch (error) {
    console.error('Failed to toggle admin status:', error);
    return { success: false, message: 'Failed to update user role.' };
  }
}