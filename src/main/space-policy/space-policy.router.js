import express from 'express';
import spacePolicyService from './space-policy.service.js';
import verifyToken from '../../middleware/auth.guard.js';

const router = express.Router();

router.post('/space/policy', verifyToken, async (req, res) => {
    try {
        const data = await spacePolicyService.createSpacePolicy(undefined, req.body);
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

router.get('/space/:spaceId/policies', async (req, res) => {
    try {
        if (!req.params.spaceId) throw new Error('spaceId null !');
        const spaceId = req.params.spaceId;

        const { data, count } = await spacePolicyService.getSpacePolicies(spaceId);

        if (count < 1) {
            return res.status(404).send({ message: 'data not found' });
        }
        return res.status(200).send({ data, count, message: 'success get data' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Error', error });
    }
});

router.get('/space/policy/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) throw new Error('id null !');

        const data = await spacePolicyService.getSpacePolicyById(id);
        return res.status(200).send({ data, message: 'success get data' });
    } catch (error) {
        return res.status(500).send({ error });
    }
});

router.put('/space/policy/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) throw new Error('id null !');

        const data = await spacePolicyService.updateSpacePolicy(id, req.body.newPolicy);
        if (data) {
            return res.status(200).json({ data, message: 'success update data' });
        } else {
            return res.status(400).json({ message: 'Failed to update data' });
        }
    } catch (error) {
        return res.status(400).json({ message: 'error', error: error.message });
    }
});

router.delete('/space/policy/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) throw new Error('id null !');

        const data = await spacePolicyService.deleteSpacePolicy(id);
        return res.status(200).send({ data, message: 'success delete data' });
    } catch (error) {
        return res.status(500).send({ error });
    }
});

export default router;
