"use server";
import { cookies } from "next/headers";

export async function getUserToken() {
  const cookieStore = await cookies(); // No need for `await`
  const token = await cookieStore.get("token");
  return token?.value;
}
