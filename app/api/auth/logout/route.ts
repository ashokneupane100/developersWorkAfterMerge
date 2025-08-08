import { NextResponse } from "next/server";

export async function POST() {
  const headers = new Headers();

  const clear = (name: string) =>
    headers.append(
      "Set-Cookie",
      `${name}=; Max-Age=0; Path=/; SameSite=Lax; HttpOnly`
    );

  ["agent_token", "agent_role", "agent_id", "agent_email", "agent_name"].forEach(clear);

  // If you previously set a Domain (e.g. .yourdomain.com), also send a second
  // Set-Cookie with Domain to ensure deletion there too:
  // headers.append("Set-Cookie", `agent_token=; Max-Age=0; Path=/; Domain=.yourdomain.com; SameSite=Lax; HttpOnly`);

  return new NextResponse(null, { headers });
}
