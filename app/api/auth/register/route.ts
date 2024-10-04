import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { sql } from "@vercel/postgres";
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    // YOU MAY WANT TO ADD SOME VALIDATION HERE

    console.log({ email, password });

    const id = nanoid(); // Generate unique id using nanoid
    const hashedPassword = await hash(password, 10);

    const response =
      await sql`INSERT INTO users (id, email, password) VALUES (${id}, ${email}, ${hashedPassword})`;

    console.log("User inserted successfully:", response);
  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: "success" });
}
