const pool = require('../config/db');

const findAllByUsuario = async (usuario_id, limit, offset) => {
    const query = 'SELECT * FROM ejercicios WHERE usuario_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3';
    const result = await pool.query(query, [usuario_id, limit, offset]);
    const countQuery = 'SELECT COUNT(*) FROM ejercicios WHERE usuario_id = $1';
    const countResult = await pool.query(countQuery, [usuario_id]);
    
    return {
        data: result.rows,
        total: parseInt(countResult.rows[0].count)
    };
};

const create = async ({ nombre, musculo, series, reps, peso, usuario_id }) => {
    const query = `
        INSERT INTO ejercicios (nombre, musculo, series, reps, peso, usuario_id) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const result = await pool.query(query, [nombre, musculo, series, reps, peso, usuario_id]);
    return result.rows[0];
};

const deleteById = async (id, usuario_id) => {
    const query = 'DELETE FROM ejercicios WHERE id = $1 AND usuario_id = $2 RETURNING *';
    const result = await pool.query(query, [id, usuario_id]);
    return result.rowCount > 0;
};

module.exports = { findAllByUsuario, create, deleteById };