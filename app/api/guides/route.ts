import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GuideDto } from "@/types/guide";
import { ERROR_MESSAGES } from "@/constants/errors";

// Helper function to build hierarchy
function buildHierarchy(
  guides: GuideDto[],
  parentId: string | null = null
): (GuideDto & { children: GuideDto[] })[] {
  return guides
    .filter((guide) => guide.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map((guide) => ({
      ...guide,
      children: buildHierarchy(guides, guide.id),
    }));
}

// GET handler to fetch the hierarchical guide structure
export async function GET() {
  try {
    const guides: GuideDto[] = await prisma.guide.findMany({
      where: { deletedAt: null },
      orderBy: { order: "asc" },
    });

    const hierarchy = buildHierarchy(guides);
    return NextResponse.json(hierarchy, { status: 200 });
  } catch (error) {
    console.error("Error fetching guides:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
