import Category from '../models/Category.js';
import Note from '../models/Note.js';

// Get all categories with note counts
export const getCategories = async (req, res) => {
    try {
        // Aggregate categories with note counts
        const categories = await Category.aggregate([
            {
                $lookup: {
                    from: 'notes',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'notes'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    count: { $size: '$notes' },
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $sort: { name: 1 }
            }
        ]);

        res.json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ message: 'Failed to fetch categories.' });
    }
};

// Get a single category by ID

export const getCategory = async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category)
        return res.status(404).json({ message: 'Category not found' });
    res.json(category);
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
