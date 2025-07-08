import { connectMongoDB } from "../../../../../../../../lib/mongo";
import Card from "../../../../../../../models/Card";

export async function POST(req, { params }) {
    try {
        await connectMongoDB();
        const { id, listId } = params;
        const { title, description } = await req.json();

        if (!title) {
            return new Response(JSON.stringify({ error: "Card title is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Create card
        const card = new Card({
            title,
            description,
            list_id: listId,
            project_id: id
        });

        await card.save();

        return new Response(JSON.stringify(card), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
