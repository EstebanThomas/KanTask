import { connectDB } from "../../../../lib/mysql";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";


const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        const db = await connectDB();

        const [rows] = await db.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
        );

        if (rows.length === 0) {
        return new Response(JSON.stringify({ message: "User not found" }), { status: 401 });
        }

        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
        }

        // Crée un token JWT avec l'id et email
        const token = sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
        });

        // Renvoie le token dans un cookie HttpOnly (pas accessible en JS, sécurisé)
        const response = new Response(
            JSON.stringify({ message: "Logged in", user: { id: user.id, email: user.email } }),
            { status: 200 }
        );
        response.headers.append(
            "Set-Cookie",
            `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax; Secure`
        );

        return response;
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
