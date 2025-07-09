import { connectMongoDB } from "../../../../../../../../../lib/mongo";
import Card from "../../../../../../../../models/Card";
import List from "../../../../../../../../models/List"


export async function PATCH(req, { params }) {
    try {
        const { cardId } = params;
        const data = await req.json();

        await connectMongoDB();

        // Update card with new data (ex: title, description)
        const updatedCard = await Card.findByIdAndUpdate(cardId, data, {
        new: true,
        runValidators: true,
        });

        if (!updatedCard) {
        return new Response(JSON.stringify({ error: "Card not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(updatedCard), {
        status: 200,
        headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { listId, cardId } = params;

        await connectMongoDB();

        // Delete card
        const deletedCard = await Card.findByIdAndDelete(cardId);
        if (!deletedCard) {
        return new Response(JSON.stringify({ error: "Card not found" }), { status: 404 });
        }

        // Delete ID in list
        await List.findByIdAndUpdate(listId, {
        $pull: { cards: cardId }
        });

        return new Response(JSON.stringify({ message: "Card deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}