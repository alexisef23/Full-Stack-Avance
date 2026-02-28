require('dotenv').config();
const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const email = 'admin@levelup.com';
  const password = 'Admin123456';

  try {
    console.log('Creando usuario admin...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO usuarios (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, 'admin']
    );

    console.log('✅ Usuario admin creado exitosamente:');
    console.log('Email:', result.rows[0].email);
    console.log('Rol:', result.rows[0].role);
    console.log('Contraseña temporal:', password);
    console.log('\nCambia la contraseña después del primer login');

    process.exit(0);
  } catch (err) {
    if (err.code === '23505') {
      console.error('❌ El email ya existe en la base de datos');
    } else {
      console.error('❌ Error al crear admin:', err.message);
    }
    process.exit(1);
  }
}

createAdmin();
