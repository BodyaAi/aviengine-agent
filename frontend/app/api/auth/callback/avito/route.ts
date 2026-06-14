import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const url = new URL("/dashboard", request.url);
  if (code) url.searchParams.set("avito", "connected");
  if (state) url.searchParams.set("state", state);
  return NextResponse.redirect(url);
}
