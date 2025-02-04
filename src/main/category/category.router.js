import express from 'express';
import categoryService from './category.service.js';
import verifyToken from '../../middleware/auth.guard.js';

const router = express.Router();

router.post('/category', verifyToken, async (req, res) => {
  try {
    const data = await categoryService.createCategory(req.body);
    if (data) {
      return res.status(201).json({ data, message: 'success create data' });
    } else {
      // Handle case where data is falsy
      return res.status(400).json({ message: 'Failed to create data' });
    }
  } catch (error) {
    // console.error(error); // Use console.error for errors
    return res.status(400).json({ message: 'Name is required', error: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    let params = {};
    if (req.body.page) {
      params.page = req.body.page;
    }
    if (req.body.size) {
      params.size = req.body.size;
    }
    if (req.body.name) {
      params.name = req.body.name;
    }

    const data = await categoryService.getCategories(params);
    return res.status(200).send({ ...data, message: 'success get data' });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get('/category/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error('id null !');

    const data = await categoryService.getCategoryById(id);
    return res.status(200).send({ data, message: 'success get data' });
  } catch (error) {
    return res.status(500).send({ error });
  }
});
router.put('/category/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error('id null !');

    const data = await categoryService.updateCategory(id, req.body);
    return res.status(200).send({ data, message: 'success update data' });
  } catch (error) {
    return res.status(500).send({ error });
  }
});
router.delete('/category/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error('id null !');

    const data = await categoryService.deleteCategory(id);
    return res.status(200).send({ data, message: 'success delete data' });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

export default router;
