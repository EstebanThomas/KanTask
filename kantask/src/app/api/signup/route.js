import { connectDB } from "../../../../lib/mysql";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return new Response(JSON.stringify({ message: "All fields are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const db = await connectDB();

        // Check if email is already used
        const [existingUser] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return new Response(JSON.stringify({ message: "Email already exists" }), {
                status: 409,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add user to DB
        const [result] = await db.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        const userId = result.insertId;

        // Create JWT
        const token = sign(
            { id: userId, email},
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return new Response(
            JSON.stringify({ message: "Authenticated", user: { id: userId, email } }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`,
                },
            }
        );
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}

