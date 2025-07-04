import Note from '../models/Note.js';
import Category from '../models/Category.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const storage = multer.memoryStorage(); // Store file in memory for direct upload to Cloudinary
export const upload = multer({ storage });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const getNotes = async (req, res) => {
    const { page = 1, limit = 10, search = '', category } = req.query;
    const query = {};
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } }
        ];
    }
    if (category) {
        query.category = category;
    }
    const notes = await Note.find(query)
        .sort({ updatedAt: -1 })
        .skip((+page - 1) * +limit)
        .limit(+limit)
        .populate('category')
        .populate('user', 'username'); // ইউজারনেম দেখানোর জন্য
    const total = await Note.countDocuments(query);
    res.json({ notes, total });
};

export const getNote = async (req, res) => {
    const note = await Note.findById(req.params.id)
        .populate('category')
        .populate('user', 'username');
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    res.json(note);
};

export const createNote = async (req, res) => {
    const { title, content, category, author, tags, imageUrl } = req.body;
    if (!title || !content || !category)
        return res.status(400).json({ message: 'All fields required.' });
    const cat = await Category.findOne({ name: category });
    if (!cat) return res.status(400).json({ message: 'Invalid category.' });
    const note = await Note.create({
        title,
        content,
        category,
        author,
        tags,
        imageUrl,
        user: req.userId // ইউজার আইডি সংরক্ষণ
    });
    res.status(201).json(note);
};

export const updateNote = async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    if (!req.userId || note.user.toString() !== req.userId)
        return res.status(403).json({ message: 'Unauthorized' });

    const { title, content, category, author, tags, imageUrl } = req.body;
    note.title = title;
    note.content = content;
    note.category = category;
    note.author = author;
    note.tags = tags;
    note.imageUrl = imageUrl;
    await note.save();
    res.json(note);
};

export const deleteNote = async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    if (!req.userId || note.user.toString() !== req.userId)
        return res.status(403).json({ message: 'Unauthorized' });

    await note.deleteOne();
    res.json({ message: 'Note deleted.' });
};

export const uploadPhoto = async (req, res) => {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    if (!req.file)
        return res.status(400).json({ message: 'No file uploaded.' });

    // Upload buffer to Cloudinary
    try {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'note-organizer' },
            async (error, result) => {
                if (error)
                    return res
                        .status(500)
                        .json({ message: 'Cloudinary upload failed.' });
                note.photo = result.secure_url;
                await note.save();
                res.json(note);
            }
        );
        stream.end(req.file.buffer);
    } catch (err) {
        res.status(500).json({ message: 'Photo upload failed.' });
    }
};
