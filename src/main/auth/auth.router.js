import express from 'express';
import { supabase } from '../../lib/supabase.js';
import { register, login } from './auth.service.js';
import verifyToken from '../../middleware/auth.guard.js';

const router = express.Router();
// router.post('/auth/register', register);

router.post('/auth/login', async (req, res) => {
    try {        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: req.body.email,
            password: req.body.password,
        });
        if (error || !data.session) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const { access_token, refresh_token } = data.session;
    
        return res.status(200).json({ access_token, refresh_token });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

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
