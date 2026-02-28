const pool = require('../config/db');

class UsuariosRepository {
  async findById(id) {
    const result = await pool.query(
      'SELECT id, email, role, created_at FROM usuarios WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  async create(email, hashedPassword, role = 'user') {
    const result = await pool.query(
      'INSERT INTO usuarios (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
      [email, hashedPassword, role]
    );
    return result.rows[0];
  }

  async update(id, updates) {
    const fields = Object.keys(updates || {});
    if (fields.length === 0) {
      return this.findById(id);
    }
    const values = Object.values(updates);
    values.push(id);

    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');

    const result = await pool.query(
      `UPDATE usuarios SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, email, role, created_at`,
      values
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  async getAllUsers(limit = 10, offset = 0) {
    const result = await pool.query(
      'SELECT id, email, role, created_at FROM usuarios LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }
}

module.exports = new UsuariosRepository();
