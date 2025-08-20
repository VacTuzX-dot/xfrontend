import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const res = await fetch(
      "https://backend-nextjs-virid.vercel.app/api/users",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Handle login action by checking existing users
    if (body.action === "login") {
      const res = await fetch(
        "https://backend-nextjs-virid.vercel.app/api/users",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const users = await res.json();
      const user = users.find((u) => u.username === body.username);

      if (user && (await bcrypt.compare(body.password, user.password))) {
        return NextResponse.json(user);
      }

      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Default behavior for user creation
    const res = await fetch(
      "https://backend-nextjs-virid.vercel.app/api/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
