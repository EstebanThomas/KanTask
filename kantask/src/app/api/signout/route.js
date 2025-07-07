export async function POST(req) {
    const response = new Response(
        JSON.stringify({ message: "Logged out" }),
        { status: 200 }
    );
    response.headers.append(
        "Set-Cookie",
        "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure"
    );
    return response;
}
