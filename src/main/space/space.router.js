import express from 'express';
import spaceService from './space.service.js';
import verifyToken from '../../middleware/auth.guard.js';
import spaceImageService from '../space-image/space-image.service.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

router.post('/space', verifyToken, upload.array('images'), async (req, res) => {
    try {
        const { images: imagesData, ...spaceData } = req.body;
        const files = req.files;
        const data = await spaceService.createSpaceWithImage(spaceData, files);
        if (data) {
            return res.status(201).json({ data, message: 'success create data' });
        } else {
            // Handle case where data is falsy
            return res.status(400).json({ message: 'Failed to create data' });
        }
    } catch (error) {
        console.error(error); // Use console.error for errors
        return res
            .status(400)
            .json({
                message: 'Name, capacity and pricePerHour are required',
                error: error.message,
            });
    }
});

router.get('/space', verifyToken, async (req, res) => {
    try {
        let params = {};
        if (req.query.page) {
            params.page = req.query.page;
        }
        if (req.query.size) {
            params.size = req.query.size;
        }
        if (req.query.name) {
            params.name = req.query.name;
        }

        const data = await spaceService.getSpaces(params);
        return res.status(200).send({ ...data, message: 'success get data' });
    } catch (error) {
        return res.status(500).send({ error });
    }
});

router.get('/space/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) throw new Error('id null !');

        const data = await spaceService.getSpaceById(id);
        return res.status(200).send({ data, message: 'success get data' });
    } catch (error) {
        return res.status(500).send({ error });
    }
});

router.get('/space/:id/images', verifyToken, async (req, res) => {
    try {
        const spaceId = req.params.id;
        if (!spaceId) throw new Error('space id null !');

        const data = await spaceImageService.getSpaceImages(spaceId);
        return res.status(200).send({ data, message: 'success get data' });
    } catch (error) {
        return res.status(500).send({ error });
    }
});

router.put('/space/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) throw new Error('id null !');

        const data = await spaceService.updateSpace(id, req.body);
        return res.status(200).send({ data, message: 'success update data' });
    } catch (error) {
        return res.status(500).send({ error });
    }
});
router.delete('/space/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) throw new Error('id null !');

        const data = await spaceService.deleteSpace(id);
        return res.status(200).send({ data, message: 'success delete data' });
    } catch (error) {
        return res.status(500).send({ error });
    }
});

export default router;
