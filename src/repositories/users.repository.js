const pool = require('../config/db');

class UsersRepository {
    async createUser(email, password) {
        const query = 'INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING id, email, role';
        const values = [email, password];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async findByEmail(email) {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const values = [email];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}

module.exports = new UsersRepository();