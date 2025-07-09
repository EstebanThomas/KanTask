import { connectMongoDB } from "../../../../../../../../../lib/mongo";
import Card from "../../../../../../../../models/Card";

export async function DELETE(req, { params }) {
    try {
        const { id, cardId } = await params;

        await connectMongoDB();

        // delete card
        const deletedCard = await Card.findByIdAndDelete(cardId);

        if (!deletedCard) {
            return new Response(JSON.stringify({ error: "Card not found" }), { status: 404 });
        }

        //ORDER
        const [rows] = await db.execute("SELECT card_order FROM projects WHERE id = ?", [id]);
        const currentOrder = rows[0].card_order ? JSON.parse(rows[0].card_order) : [];
        const newOrder = currentOrder.filter((cId) => cId !== cardId);

        await db.execute("UPDATE projects SET card_order = ? WHERE id = ?", [
            JSON.stringify(newOrder),
            id,
        ]);

        return new Response(
            JSON.stringify({ message: "Card deleted" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}

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