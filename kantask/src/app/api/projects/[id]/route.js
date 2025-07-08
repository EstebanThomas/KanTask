import { connectDB } from "../../../../../lib/mysql";

export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const { name } = await req.json();

        const db = await connectDB();
        await db.execute(
            "UPDATE projects SET name = ?, updated_at = NOW() WHERE id = ?",
            [name, id]
        );

        return new Response(JSON.stringify({ message: "Project updated" }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = params;

        const db = await connectDB();
        await db.execute(
            "DELETE FROM projects WHERE id = ?",
            [id]
        );

        return new Response(JSON.stringify({ message: "Project deleted" }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}