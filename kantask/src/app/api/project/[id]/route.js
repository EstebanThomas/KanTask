import { connectDB } from "../../../../../lib/mysql";

export async function GET(req, context) {
    try {
        const { params } = await context;
        const { id } = params;
        const db = await connectDB();
        const [rows] = await db.execute(
            "SELECT id, name AS title FROM projects WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: "Project not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(rows[0]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Error server" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
