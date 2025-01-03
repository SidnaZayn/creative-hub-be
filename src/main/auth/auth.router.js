import express from 'express';
import { register, login } from './auth.service.js';
import verifyToken from '../../middleware/auth.guard.js';

const router = express.Router();

// router.post('/auth/register', register);

// router.post('/auth/login', login);

router.post('/auth/logout', (req, res) => {
  res.send('Logout');
});

router.get('/auth/me', verifyToken, async (req, res) => {
  const user = req.user;

  return res.status(200).send(user);
});

// router.put('users/:id', (req, res) => {
//   res.send('update: ' + req.params.id);
// });

// router.delete('users/:id', (req, res) => {
//   res.send('delete: ' + req.params.id);
// });

export default router;
