const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importa el modelo de usuario si lo tienes

router.get('/register', async (req, res) => {
  try {
      const hashedPassword = await bcrypt.hash("kakakaka123", 10);
      const user = new User({
          username: "admin",
          password: hashedPassword
      });
      await user.save();
      res.status(201).send('Usuario registrado correctamente');
  } catch {
      res.status(500).send('Error al registrar el usuario');
  }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send('Usuario no encontrado');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Contraseña incorrecta');

  const token = jwt.sign({ _id: user._id }, 'claveSecreta'); // Reemplaza 'claveSecreta' con tu propia clave secreta
  res.header('auth-token', token).send(token);
});

module.exports = router;
