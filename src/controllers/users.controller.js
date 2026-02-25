const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usersRepo = require('../repositories/users.repository');

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const existingUser = await usersRepo.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await usersRepo.createUser(email, hashedPassword);
        res.status(201).json({ message: 'Usuario registrado', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await usersRepo.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Generar Token
        const payload = { id: user.id, email: user.email, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login };