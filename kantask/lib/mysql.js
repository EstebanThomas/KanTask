import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function connectMysql() {
    const connection = await pool.getConnection();
    await connection.ping(); // ping to test connection
    connection.release();
    return true;
}

export async function connectDB() {
    return pool;
}

export async function getUser(id) {
    const [rows] = await db.execute("SELECT id, name, email FROM users WHERE id = ?", [id]);
    return rows[0];
}