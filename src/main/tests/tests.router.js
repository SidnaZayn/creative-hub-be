import verifyToken from '../../middleware/auth.guard.js';
import express from 'express';

const router = express.Router();

router.get('/protected-route', verifyToken, (req, res) => {
  try {
    return res.status(200).send({ message: 'Success' });
  } catch (err) {
    console.log(err);
    return res.status(401).send({ error: true, message: err });
  }
});

// router.get('/superadmin', verifyToken, (req, res) => {
//   try {
//     if (req.user.isAdmin) return res.send('you are Admin');
//     throw new Error('You are not Admin');
//   } catch (err) {
//     // console.log(err)
//     return res.status(401).send({ error: true, message: err.toString() });
//   }
// });

export default router;
