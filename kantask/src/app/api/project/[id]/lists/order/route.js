import { connectDB } from "../../../../../../../lib/mysql";

export async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const { newOrder } = await req.json();

        if (!Array.isArray(newOrder)) {
            return new Response(JSON.stringify({ error: "Invalid order format" }), { status: 400 });
        }

        const db = await connectDB();
        await db.execute("UPDATE projects SET list_order = ? WHERE id = ?", [
            JSON.stringify(newOrder),
            id,
        ]);

        return new Response(JSON.stringify({ message: "Order updated" }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
