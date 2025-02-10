export type GuideDto = {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  order: number;
  authorId: string;
};

export type Guide = GuideDto & { children: Guide[] | [] };

