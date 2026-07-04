import { prisma } from "@/lib/prisma";

// メニュー更新 body: { name?, active?, sortOrder? }
export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/items/[id]">,
) {
  const { id } = await ctx.params;
  let body: { name?: string; active?: boolean; sortOrder?: number };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const data: { name?: string; active?: boolean; sortOrder?: number } = {};
  if (typeof body.name === "string" && body.name.trim()) {
    data.name = body.name.trim();
  }
  if (typeof body.active === "boolean") data.active = body.active;
  if (typeof body.sortOrder === "number") data.sortOrder = body.sortOrder;

  if (Object.keys(data).length === 0) {
    return Response.json({ error: "nothing to update" }, { status: 400 });
  }

  const updated = await prisma.menuItem.update({ where: { id }, data });
  return Response.json(updated);
}

// メニュー削除（入力データも cascade で削除）
export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/items/[id]">,
) {
  const { id } = await ctx.params;
  await prisma.menuItem.delete({ where: { id } });
  return Response.json({ ok: true });
}
