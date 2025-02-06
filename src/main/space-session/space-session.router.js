import express from 'express';
import spaceSessionService from './space-session.service.js';
import verifyToken from '../../middleware/auth.guard.js';

const router = express.Router();

router.post('/space/sessions', verifyToken, async (req, res) => {
    try {
        const data = await spaceSessionService.createSpaceSession(undefined, req.body);
        if (data) {
            return res.status(201).json({ data, message: 'success create data' });
        } else {
            // Handle case where data is falsy
            return res.status(400).json({ message: 'Failed to create data' });
        }
    } catch (error) {
        // console.error(error); // Use console.error for errors
        return res.status(400).json({ message: 'error', error: error.message });
    }
});

router.get('/space/:spaceId/sessions', async (req, res) => {
    try {
        if (!req.params.spaceId) throw new Error('spaceId null !');

        let params = {};
        if (req.query.page) {
            params.page = req.query.page;
        }
        if (req.query.size) {
            params.size = req.query.size;
        }
        if (req.params.spaceId) {
            params.spaceId = req.params.spaceId;
        }

        const { data, count } = await spaceSessionService.getSpaceSessions(params);
        if (count < 1) {
            return res.status(404).send({ message: 'data not found' });
        }
        return res.status(200).send({ data, count, message: 'success get data' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Error', error });
    }
});

router.get('/space/sessions/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) throw new Error('id null !');

        const data = await spaceSessionService.getSpaceSessionById(id);
        return res.status(200).send({ data, message: 'success get data' });
    } catch (error) {
        return res.status(500).send({ error });
    }
});

router.delete('/space/sessions/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) throw new Error('id null !');

        const data = await spaceSessionService.deleteSpaceSession(id);

        return res.status(200).send({ data, message: 'success delete data' });
    } catch (error) {
        return res.status(500).send({ error });
    }
});

export default router;
