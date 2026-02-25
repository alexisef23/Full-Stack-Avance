const pool = require('../config/db');

class EjerciciosRepository {
    async findAll(limit = 10, offset = 0) {
        const query = 'SELECT * FROM ejercicios ORDER BY id ASC LIMIT $1 OFFSET $2';
        const result = await pool.query(query, [limit, offset]);
        return result.rows;
    }

    async create(ejercicio) {
        const { nombre, musculo, series, reps, peso } = ejercicio;
        const result = await pool.query(
            'INSERT INTO ejercicios (nombre, musculo, series, reps, peso) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, musculo, series, reps, peso]
        );
        return result.rows[0];
    }

    async update(id, ejercicio) {
        const { nombre, musculo, series, reps, peso } = ejercicio;
        const query = `
            UPDATE ejercicios 
            SET nombre = $1, musculo = $2, series = $3, reps = $4, peso = $5 
            WHERE id = $6 
            RETURNING *`;
        const values = [nombre, musculo, series, reps, peso, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM ejercicios WHERE id = $1 RETURNING *', [id]);
        return result.rowCount > 0;
    }
}

module.exports = new EjerciciosRepository();