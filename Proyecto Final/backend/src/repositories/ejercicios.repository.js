const pool = require('../config/db');

class EjerciciosRepository {
  async findById(id) {
    const result = await pool.query(
      'SELECT id, nombre, musculo, created_at FROM ejercicios_catalogo WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async findByName(nombre) {
    const result = await pool.query(
      'SELECT id, nombre, musculo, created_at FROM ejercicios_catalogo WHERE LOWER(nombre) = LOWER($1)',
      [nombre]
    );
    return result.rows[0];
  }

  async findAll(limit = 10, offset = 0, musculo = null) {
    let query = 'SELECT id, nombre, musculo, created_at FROM ejercicios_catalogo';
    const values = [];

    if (musculo) {
      query += ' WHERE LOWER(musculo) = LOWER($1)';
      values.push(musculo);
      query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
      values.push(limit, offset);
    } else {
      query += ` LIMIT $1 OFFSET $2`;
      values.push(limit, offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  async countAll(musculo = null) {
    let query = 'SELECT COUNT(*) as count FROM ejercicios_catalogo';
    const values = [];

    if (musculo) {
      query += ' WHERE LOWER(musculo) = LOWER($1)';
      values.push(musculo);
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async create(nombre, musculo) {
    const result = await pool.query(
      'INSERT INTO ejercicios_catalogo (nombre, musculo) VALUES ($1, $2) RETURNING id, nombre, musculo, created_at',
      [nombre, musculo]
    );
    return result.rows[0];
  }

  async update(id, nombre, musculo) {
    const result = await pool.query(
      'UPDATE ejercicios_catalogo SET nombre = $1, musculo = $2 WHERE id = $3 RETURNING id, nombre, musculo, created_at',
      [nombre, musculo, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM ejercicios_catalogo WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = new EjerciciosRepository();
