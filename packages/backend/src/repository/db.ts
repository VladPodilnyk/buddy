import postgres from "postgres";

// A dummy way to create a connector to the database
// The proper way is to use a config for initialization
// and create a connector in a bootstrap file (index.ts)
export const sql = postgres({
  host: "localhost",
  port: 5432,
  database: 'chat_db',      // Name of the database
  username: 'chat_user',    // Database user
  password: 'chat_password' // User's password
});

export const PREDEFINED_USERS = [
  {username: "power_ranger_red", password: "1234"},
  {username: "power_ranger_blue", password: "4321"}
] as const;
