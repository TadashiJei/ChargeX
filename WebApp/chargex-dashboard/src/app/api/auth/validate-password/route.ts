import { NextResponse } from "next/server";
import { validatePassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const result = validatePassword(password);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Password validation error:", error);
    return NextResponse.json(
      { message: "Error validating password" },
      { status: 500 }
    );
  }
}
