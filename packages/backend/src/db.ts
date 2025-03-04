import postgres from "postgres";

export const sql = postgres({
  host: "localhost",
  port: 5432,
  database: 'chat_db',      // Name of the database
  username: 'chat_user',    // Database user
  password: 'chat_password' // User's password
});
