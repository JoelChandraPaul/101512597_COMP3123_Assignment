import express from 'express';
import Employee from '../models/Employee.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.use('/images', express.static('uploads'));

// SEARCH FIRST
router.get('/employees/search', async (req, res) => {
  try {
    const { department, position } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (position) filter.position = position;
    const result = await Employee.find(filter);
    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ message: 'Search failed' });
  }
});

// GET ALL
router.get('/employees', async (req, res) => {
  res.status(200).json(await Employee.find());
});

// GET ONE
router.get('/employees/:id', async (req, res) => {
  res.status(200).json(await Employee.findById(req.params.id));
});

// CREATE (with image upload)
router.post('/employees', upload.single('profileImage'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.profile_image = `/uploads/${req.file.filename}`;
    await new Employee(data).save();
    return res.status(201).json({ message: 'Employee added' });
  } catch {
    return res.status(500).json({ message: 'Employee create failed' });
  }
});

// UPDATE (with image upload)
router.put('/employees/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.profile_image = `/uploads/${req.file.filename}`;
    await Employee.findByIdAndUpdate(req.params.id, data);
    return res.status(200).json({ message: 'Employee updated' });
  } catch {
    return res.status(500).json({ message: 'Update failed' });
  }
});

// DELETE
router.delete('/employees/:id', async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  return res.status(204).send();
});

export default router;
