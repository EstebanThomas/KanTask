import { connectDB } from "../../../../../../lib/mysql";

export async function GET(req) {
    try {

        const url = new URL(req.url);
        const id = url.pathname.split("/").pop(); // get the final part of url (id)

        const db = await connectDB();
        const [rows] = await db.execute(
            "SELECT id, name AS title FROM projects WHERE user_id = ?",
            [id]
        );

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
