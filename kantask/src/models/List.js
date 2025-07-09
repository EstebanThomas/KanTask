import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
}, { timestamps: true });

const listSchema = new mongoose.Schema({
    name: { type: String, required: true },
    project_id: { type: String, required: true },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }]
}, { timestamps: true });

export default mongoose.models.List || mongoose.model("List", listSchema);
