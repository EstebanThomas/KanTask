import mongoose from "mongoose";

const CardSchema = new mongoose.Schema(
    {
        title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        },
        description: {
        type: String,
        trim: true,
        maxlength: 500,
        default: "",
        },
        list_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
        required: true,
        },
        project_id: {
        type: Number,
        required: true,
        },
        createdAt: {
        type: Date,
        default: Date.now,
        },
        updatedAt: {
        type: Date,
        default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Card || mongoose.model("Card", CardSchema);
