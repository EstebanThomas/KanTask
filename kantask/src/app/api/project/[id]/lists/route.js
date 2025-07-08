import { connectMongoDB } from "../../../../../../lib/mongo";
import { connectDB } from "../../../../../../lib/mysql";
import List from "../../../../../models/List";

export async function POST(req, { params }) {
    try {
        const { id } = params; // project id
        const { name } = await req.json();

        if (!name) {
            return new Response(JSON.stringify({ error: "List name required" }), { status: 400 });
        }

        // Project in MySQL
        const db = await connectDB();
        const [rows] = await db.execute("SELECT id FROM projects WHERE id = ?", [id]);
        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
        }

        const currentOrder = rows[0].list_order ? JSON.parse(rows[0].list_order) : [];

        // New list
        const list = new List({
            name,
            project_id: id,
        });
        await list.save();

        currentOrder.push(list._id.toString());
        await db.execute("UPDATE projects SET list_order = ? WHERE id = ?", [
            JSON.stringify(currentOrder),
            id,
        ]);

        return new Response(
            JSON.stringify(list),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
