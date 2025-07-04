import Category from '../models/Category.js';

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch categories.' });
    }
};

// Create a new category
export const createCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const exists = await Category.findOne({ name });
    if (exists)
        return res.status(400).json({ message: 'Category already exists' });
    const category = await Category.create({ name });
    res.status(201).json(category);
};

// Update a category
export const updateCategory = async (req, res) => {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name },
        { new: true }
    );
    if (!category)
        return res.status(404).json({ message: 'Category not found' });
    res.json(category);
};

// Delete a category
export const deleteCategory = async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
        return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
};
