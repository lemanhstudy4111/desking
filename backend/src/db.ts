// db.js
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();
const connectionString = process.env.DATABASE_URL_IPV4 || "";
const sql = postgres(connectionString as string);

export default sql;
