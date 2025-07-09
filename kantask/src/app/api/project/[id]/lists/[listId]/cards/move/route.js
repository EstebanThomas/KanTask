import { connectMongoDB } from '../../../../../../../../../lib/mongo';
import mongoose from 'mongoose';
import Card from '../../../../../../../../models/Card';
import List from '../../../../../../../../models/List';

export async function PATCH(req, { params }) {
    try {
        await connectMongoDB();

        const { cardId, fromListId, toListId, newIndex } = await req.json();

        // find Card
        const card = await Card.findById(cardId);
        if (!card) return new Response(JSON.stringify({ error: "Card not found" }), { status: 404 });

        // Change List
        if (fromListId !== toListId) {
            // Delete from old list
            await List.findByIdAndUpdate(fromListId, {
                $pull: { cards: cardId }
            });

            // Add Card Id
            const toList = await List.findById(toListId);
            if (!toList) return new Response(JSON.stringify({ error: "Destination list not found" }), { status: 404 });

            const cards = [...toList.cards.map(c => c.toString())];
            cards.splice(newIndex, 0, cardId);

            toList.cards = cards;
            await toList.save();

            card.list = toListId;
            await card.save();

        } else {

            const list = await List.findById(fromListId);
            if (!list) return new Response(JSON.stringify({ error: "List not found" }), { status: 404 });

            const cards = [...list.cards.map(c => c.toString())];

            const oldIndex = cards.indexOf(cardId);
            if (oldIndex > -1) cards.splice(oldIndex, 1);

            cards.splice(newIndex, 0, cardId);

            list.cards = cards;
            await list.save();
        }

        return new Response(JSON.stringify({ message: "Card moved successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
