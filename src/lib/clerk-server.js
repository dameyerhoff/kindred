// src/lib/clerk-server.js
import { auth } from "@clerk/nextjs/server";

export async function getUserId() {
  const { userId } = await auth();
  return userId;
}
