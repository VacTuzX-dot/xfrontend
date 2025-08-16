// app/api/users/[id]/route.js
export const runtime = "nodejs";

export async function GET(_req, { params }) {
  const r = await fetch(`${process.env.BACKEND_URL}/api/users/${params.id}`, {
    cache: "no-store",
  });
  const data = await r.json();
  return Response.json(data, { status: r.status });
}

export async function DELETE(_req, { params }) {
  const r = await fetch(`${process.env.BACKEND_URL}/api/users/${params.id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  const data = await r.json();
  return Response.json(data, { status: r.status });
}
