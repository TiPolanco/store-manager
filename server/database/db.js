import Pool from "pg-pool";

const pool = new Pool({
    database: "postgres",
    host: "localhost",
    password: "postgres",
    port: "5432",
    user: "postgres",
});

export default pool;