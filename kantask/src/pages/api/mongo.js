import { connectMongo } from "../../../lib/mongodb";

export default async function handler(req, res) {
    try {
        await connectMongo();
        res.status(200).json({ message: "MongoDB Connected ✅" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Connection failed ❌" });
    }
}
