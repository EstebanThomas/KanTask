import { connectMongoDB } from "../../../../../../../lib/mongo";
import List from "../../../../../../models/List";

export async function PATCH(req, { params }) {
    try {
        const { id, listId } = params;
        const { name } = await req.json();

        if (!name) {
            return new Response(JSON.stringify({ error: "List name required" }), { status: 400 });
        }

        await connectMongoDB();

        // Update list
        const updated = await List.findByIdAndUpdate(
            listId,
            { name },
            { new: true }
        );

        if (!updated) {
            return new Response(JSON.stringify({ error: "List not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(updated), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id, listId } = params;

        await connectMongoDB();

        // delete list
        const deletedList = await List.findByIdAndDelete(listId);

        if (!deletedList) {
            return new Response(JSON.stringify({ error: "List not found" }), { status: 404 });
        }

        // Delete cards in list
        await Card.deleteMany({ list_id: listId });

        //ORDER
        const [rows] = await db.execute("SELECT list_order FROM projects WHERE id = ?", [id]);
        const currentOrder = rows[0].list_order ? JSON.parse(rows[0].list_order) : [];
        const newOrder = currentOrder.filter((lId) => lId !== listId);

        await db.execute("UPDATE projects SET list_order = ? WHERE id = ?", [
            JSON.stringify(newOrder),
            id,
        ]);

        return new Response(
            JSON.stringify({ message: "List and cards deleted" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
