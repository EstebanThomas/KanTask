import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    list_id: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
}, { timestamps: true });

export default mongoose.models.Card || mongoose.model("Card", CardSchema);
