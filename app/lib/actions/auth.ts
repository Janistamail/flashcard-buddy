"use server";

import { signIn, signOut } from "@/app/lib/auth";

export async function signInWithGoogleAction(callbackUrl: string) {
  await signIn("google", { redirectTo: callbackUrl });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
