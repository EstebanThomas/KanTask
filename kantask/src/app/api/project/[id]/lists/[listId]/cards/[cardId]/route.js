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