import { connectMongoDB } from "../../../../../../../../lib/mongo";
import Card from "../../../../../../../models/Card";
import List from "../../../../../../../models/List"
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    try {

        await connectMongoDB();
        
        const { id, listId } = await params;
        const { title, description } = await req.json();

        if (!title) {
            return new Response(JSON.stringify({ error: "Card title is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const list = await List.findById(listId);
        if (!list) {
            return new Response(JSON.stringify({ error: "List not found" }), { status: 404 });
        }

        // Create card
        const card = new Card({
            title,
            description,
            list_id: list._id
        });
        await card.save();

        list.cards.push(card._id);
        await list.save();

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


export async function GET(req, { params }) {

    const { id: projectId } = params;

    try {
        await connectMongoDB();

        const cards = await Card.find({ project_id: projectId });

        const normalizedCards = cards.map((card) => ({
        ...card._doc,
        id: card._id.toString(),
        }));

        return NextResponse.json(normalizedCards, { status: 200 });
    } catch (err) {
        console.error("Err0r API GET cards:", err);
        return NextResponse.json(
        { error: "Unable to retrieve cards" },
        { status: 500 }
        );
    }
}
