import express from 'express';
import spaceImageService from './space-image.service.js';
import verifyToken from '../../middleware/auth.guard.js';

const router = express.Router();

router.post('/space/image', verifyToken, async (req, res) => {
  try {
    const data = await spaceImageService.createSpaceImage(req.body);
    if (data) {
      return res.status(201).json({ data, message: 'success create data' });
    } else {
      // Handle case where data is falsy
      return res.status(400).json({ message: 'Failed to create data' });
    }
  } catch (error) {
    // console.error(error); // Use console.error for errors
    return res
      .status(400)
      .json({ message: 'filename, url and space id is required', error: error.message });
  }
});

router.get('/space/image', verifyToken, async (req, res) => {
  try {
    if (!req.query.spaceId) throw new Error('spaceId null !');

    let params = {};
    if (req.query.page) {
      params.page = req.query.page;
    }
    if (req.query.size) {
      params.size = req.query.size;
    }
    if (req.query.spaceId) {
      params.spaceId = req.query.spaceId;
    }

    const data = await spaceImageService.getSpaceImages(params);
    return res.status(200).send({ data, message: 'success get data' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Error', error });
  }
});

router.get('/space/image/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error('id null !');

    const data = await spaceImageService.getSpaceImageById(id);
    return res.status(200).send({ data, message: 'success get data' });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.delete('/space/image/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error('id null !');
    
    const data = await spaceImageService.deleteSpaceImage(id);

    return res.status(200).send({ data, message: 'success delete data' });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

export default router;
