import { connectMysql } from "../../../lib/mysql";

export default async function handler(req, res) {
    try {
        await connectMysql();
        res.status(200).json({ message: "MySQL Connected ✅" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "MySQL Connection failed ❌", error: error.message });
    }
}
