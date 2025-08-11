import { prisma } from "@repo/database";
import { User } from "@repo/database/enums";

export const getAllOrgMembers = async (orgId: string): Promise<User[]> => {
  try {
    const members = await prisma.user.findMany({
      where: { memberships: { some: { organizationId: Number(orgId) } } },
      include: {
        memberships:true,
        refreshTokens:true,

      }
    });
    return members;
  } catch (error) {
    console.error("Failed to fetch org members:", error);
    return [];
  }
};


export const deleteOrgMember = async (memberId: string): Promise<User | null> => {
  try {
    const delMemberShip = await prisma.organizationMembership.deleteMany({
      where: {
        userId: Number(memberId)
      }
    })
    
    const deletedMember = await prisma.user.delete({
      where: {
        id: Number(memberId)
      },
      include: {memberships: true }
    })
    return deletedMember;
  } catch (error:any) {
    console.error("Failed to delete member: ", error.message)
    return null;
  }
}