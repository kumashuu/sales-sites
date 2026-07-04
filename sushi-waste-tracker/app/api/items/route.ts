import { prisma } from "@/lib/prisma";

// メニュー作成 body: { categoryId, name }
export async function POST(request: Request) {
  let body: { categoryId?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }
  const name = body.name?.trim();
  const categoryId = body.categoryId;
  if (!name || !categoryId) {
    return Response.json(
      { error: "categoryId and name are required" },
      { status: 400 },
    );
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    return Response.json({ error: "category not found" }, { status: 404 });
  }

  const max = await prisma.menuItem.aggregate({
    where: { categoryId },
    _max: { sortOrder: true },
  });
  const sortOrder = (max._max.sortOrder ?? -1) + 1;

  const item = await prisma.menuItem.create({
    data: { name, categoryId, sortOrder },
  });

  return Response.json(item, { status: 201 });
}
