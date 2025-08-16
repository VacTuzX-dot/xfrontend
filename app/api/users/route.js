// app/api/users/route.js
export const runtime = "nodejs";

export async function GET() {
  const r = await fetch(`${process.env.BACKEND_URL}/api/users`, {
    cache: "no-store",
  });
  const data = await r.json();
  return Response.json(data, { status: r.status });
}

export async function PUT(req) {
  const body = await req.json();
  const r = await fetch(`${process.env.BACKEND_URL}/api/users`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  return Response.json(data, { status: r.status });
}
