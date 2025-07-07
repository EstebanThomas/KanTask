import { connectDB } from "../../../../lib/mysql";
import { verify } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;

async function getUserFromToken(req) {
    const cookie = req.headers.get("cookie") || "";
    const tokenMatch = cookie.match(/token=([^;]+)/);

    if (!tokenMatch) {
        return null;
    }

    try {
        const decoded = verify(tokenMatch[1], JWT_SECRET);
        return decoded;
    } catch {
        return null;
    }
}

export async function GET(req) {
    try {
        const cookie = req.headers.get("cookie") || "";
        const tokenMatch = cookie.match(/token=([^;]+)/);

    if (!tokenMatch) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    const token = tokenMatch[1];

    let decoded;

    try {
        decoded = verify(token, JWT_SECRET);
    } catch {
        return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
    }

    const db = await connectDB();

    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [decoded.id]);

    if (rows.length === 0) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }
    return Response.json(rows[0]);

    } catch (error) {
        console.error("DB Error:", error);
        return Response.json({ message: "Server error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const decoded = await getUserFromToken(req);

        if (!decoded) {
            return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
        }

        const body = await req.json();
        const { name, email, password } = body;

        // Validation minimale
        if (!name || !email) {
            return new Response(JSON.stringify({ message: "Name and email required" }), { status: 400 });
        }

        const db = await connectDB();

        let query, params;

        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
            params = [name, email, hashedPassword, decoded.id];
        } else {
            query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
            params = [name, email, decoded.id];
        }

        const [result] = await db.execute(query, params);

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ id: decoded.id, name, email }), { status: 200 });

    } catch (error) {
        console.error("DB Error:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const decoded = await getUserFromToken(req);

        if (!decoded) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
        }

        const db = await connectDB();

        const [result] = await db.execute("DELETE FROM users WHERE id = ?", [decoded.id]);

        if (result.affectedRows === 0) {
        return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        // Optionnel : tu peux aussi supprimer des données associées ici (sessions, projets...)

        return new Response(JSON.stringify({ message: "User deleted successfully" }), { status: 200 });

    } catch (error) {
        console.error("DB Error:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
