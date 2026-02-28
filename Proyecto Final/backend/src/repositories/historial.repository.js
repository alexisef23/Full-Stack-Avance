const pool = require('../config/db');

class HistorialRepository {
  async findById(id) {
    const result = await pool.query(
      'SELECT id, usuario_id, ejercicio_id, fecha, series, reps, peso, created_at FROM historial_entrenamientos WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async findByUsuarioId(usuarioId, limit = 20, offset = 0) {
    const result = await pool.query(
      `SELECT
        h.id, h.usuario_id, h.ejercicio_id, h.fecha, h.series, h.reps, h.peso, h.created_at,
        e.nombre as ejercicio_nombre, e.musculo
      FROM historial_entrenamientos h
      JOIN ejercicios_catalogo e ON h.ejercicio_id = e.id
      WHERE h.usuario_id = $1
      ORDER BY h.fecha DESC, h.created_at DESC
      LIMIT $2 OFFSET $3`,
      [usuarioId, limit, offset]
    );
    return result.rows;
  }

  async countByUsuarioId(usuarioId) {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM historial_entrenamientos WHERE usuario_id = $1',
      [usuarioId]
    );
    return parseInt(result.rows[0].count, 10);
  }

  async findRecentByUsuarioId(usuarioId, days = 30) {
    const result = await pool.query(
      `SELECT
        h.id, h.usuario_id, h.ejercicio_id, h.fecha, h.series, h.reps, h.peso, h.created_at,
        e.nombre as ejercicio_nombre, e.musculo
      FROM historial_entrenamientos h
      JOIN ejercicios_catalogo e ON h.ejercicio_id = e.id
      WHERE h.usuario_id = $1 AND h.fecha >= CURRENT_DATE - ($2::text || ' days')::interval
      ORDER BY h.fecha DESC, h.created_at DESC`,
      [usuarioId, String(days)]
    );
    return result.rows;
  }

  async findByEjercicioAndUsuario(usuarioId, ejercicioId) {
    const result = await pool.query(
      `SELECT
        h.id, h.usuario_id, h.ejercicio_id, h.fecha, h.series, h.reps, h.peso, h.created_at,
        e.nombre as ejercicio_nombre, e.musculo
      FROM historial_entrenamientos h
      JOIN ejercicios_catalogo e ON h.ejercicio_id = e.id
      WHERE h.usuario_id = $1 AND h.ejercicio_id = $2
      ORDER BY h.fecha DESC, h.created_at DESC`,
      [usuarioId, ejercicioId]
    );
    return result.rows;
  }

  async create(usuarioId, ejercicioId, fecha, series, reps, peso) {
    const result = await pool.query(
      `INSERT INTO historial_entrenamientos (usuario_id, ejercicio_id, fecha, series, reps, peso)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, usuario_id, ejercicio_id, fecha, series, reps, peso, created_at`,
      [usuarioId, ejercicioId, fecha, series, reps, peso]
    );
    return result.rows[0];
  }

  async update(id, usuarioId, updates) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    values.push(id, usuarioId);

    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');

    const result = await pool.query(
      `UPDATE historial_entrenamientos
       SET ${setClause}
       WHERE id = $${fields.length + 1} AND usuario_id = $${fields.length + 2}
       RETURNING id, usuario_id, ejercicio_id, fecha, series, reps, peso, created_at`,
      values
    );
    return result.rows[0];
  }

  async delete(id, usuarioId) {
    const result = await pool.query(
      'DELETE FROM historial_entrenamientos WHERE id = $1 AND usuario_id = $2 RETURNING id',
      [id, usuarioId]
    );
    return result.rows[0];
  }
}

module.exports = new HistorialRepository();
