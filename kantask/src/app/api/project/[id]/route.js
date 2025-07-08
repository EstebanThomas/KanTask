import { connectDB } from "../../../../../lib/mysql";
import { connectMongoDB } from "../../../../../lib/mongo";
import mongoose from "mongoose";
import List from "../../../../models/List";

export async function GET(req, { params }) {
    try {
        await connectMongoDB();

        const { id } = params;

        if (isNaN(id)) {
            return new Response(JSON.stringify({ error: "Invalid project ID" }), { status: 400 });
        }

        const db = await connectDB();

        const [rows] = await db.execute(
            `SELECT projects.id, projects.name AS title, projects.list_order, users.id AS user_id, users.name AS creator
            FROM projects 
            JOIN users ON projects.user_id = users.id
            WHERE projects.id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
        }

        const project = rows[0];

        let lists = await List.find({ project_id: project.id }).lean();

        if (project.list_order) {
            const order = JSON.parse(project.list_order);
            lists.sort((a, b) => order.indexOf(a._id.toString()) - order.indexOf(b._id.toString()));
        }

        return new Response(
            JSON.stringify({
                ...project,
                lists
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}

// CREATE
export async function POST(req, { params }) {
    try {
        const { id } = params;
        const { name } = await req.json();

        if (!name) {
            return new Response(JSON.stringify({ error: "List name required" }), { status: 400 });
        }

        // project is in MySQL
        const db = await connectDB();
        const [rows] = await db.execute("SELECT id FROM projects WHERE id = ?", [id]);

        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
        }

        // New List
        const list = new List({ name, project_id: id });
        await list.save();

        let currentOrder = [];
        if (rows[0].list_order) {
            currentOrder = JSON.parse(rows[0].list_order);
        }
        currentOrder.push(list._id.toString());

        await db.execute("UPDATE projects SET list_order = ? WHERE id = ?", [
            JSON.stringify(currentOrder),
            id
        ]);

        return new Response(JSON.stringify({ message: "List created", list }), { status: 201 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}

// DELETE
export async function DELETE(req, { params }) {
    try {
        const { id } = params;

        // Delete project MySQL
        const db = await connectDB();
        const [result] = await db.execute("DELETE FROM projects WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
        }

        // Delete lists MongoDB
        await List.deleteMany({ project_id: id });

        return new Response(JSON.stringify({ message: "Project and lists deleted" }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}