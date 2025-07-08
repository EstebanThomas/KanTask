import { connectDB } from "../../../../lib/mysql";

export async function POST(req) {
    try {
        const { name, userId } = await req.json();

        if (!name || !userId) {
            return new Response(JSON.stringify({ message: "Name and userId required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const db = await connectDB();
        const [result] = await db.execute(
            "INSERT INTO projects (name, user_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
            [name, userId]
        );

        return new Response(
            JSON.stringify({ id: result.insertId, name }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
