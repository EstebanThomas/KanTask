import { connectMongoDB } from "../../../lib/mongo";

export default async function handler(req, res) {
    try {
        await connectMongoDB();
        res.status(200).json({ message: "MongoDB Connected ✅" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Connection failed ❌" });
    }
}
