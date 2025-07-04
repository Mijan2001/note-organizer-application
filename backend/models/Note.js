import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
    {
        title: String,
        content: String,
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        author: String,
        tags: [String],
        imageUrl: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Add this line
        photo: String
    },
    { timestamps: true }
);

export default mongoose.model('Note', noteSchema);
