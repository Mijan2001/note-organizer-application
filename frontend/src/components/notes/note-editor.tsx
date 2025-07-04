import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Save, X, Calendar, User, Upload, Image, Trash2 } from 'lucide-react';
import { type Note } from '@/components/ui/note-card';

interface NoteEditorProps {
    note?: Note;
    categories: Array<{ id: string; name: string }>;
    onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
    className?: string;
}

export const NoteEditor = ({
    note,
    categories,
    onSave,
    onCancel,
    className
}: NoteEditorProps) => {
    const [title, setTitle] = useState(note?.title || '');
    const [content, setContent] = useState(note?.content || '');
    const [category, setCategory] = useState(note?.category || '');
    const [author, setAuthor] = useState(note?.author || 'Anonymous');
    const [tags, setTags] = useState<string[]>(note?.tags || []);
    const [newTag, setNewTag] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    const [imageUrl, setImageUrl] = useState(note?.imageUrl || '');
    const [uploading, setUploading] = useState(false);
    const [imageError, setImageError] = useState('');

    useEffect(() => {
        const hasChanges =
            title !== (note?.title || '') ||
            content !== (note?.content || '') ||
            category !== (note?.category || '') ||
            author !== (note?.author || 'Anonymous') ||
            imageUrl !== (note?.imageUrl || '') ||
            JSON.stringify(tags) !== JSON.stringify(note?.tags || []);

        setHasChanges(hasChanges);
    }, [title, content, category, author, tags, imageUrl, note]);

    const handleSave = () => {
        if (!title.trim() || !content.trim()) return;

        onSave({
            title: title.trim(),
            content: content.trim(),
            category: category || 'General',
            author: author.trim(),
            tags: tags.filter(tag => tag.trim()),
            imageUrl: imageUrl
        });
    };

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            action();
        }
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setImageError('');
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'first-project'); // You may need to set up an unsigned upload preset
            formData.append('cloud_name', 'doezase1n');

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/doezase1n/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            const data = await response.json();
            if (data.secure_url) {
                setImageUrl(data.secure_url);
            } else {
                setImageError(
                    'Image upload failed. Please check your Cloudinary settings.'
                );
            }
        } catch (error) {
            setImageError(
                'Image upload failed. Please check your network or Cloudinary settings.'
            );
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setImageUrl('');
    };

    return (
        <Card
            className={cn(
                'max-w-4xl mx-auto shadow-hover animate-scale-in',
                className
            )}
        >
            <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 border-b border-blue-400">
                <div className="flex items-center justify-between text-white">
                    <div>
                        <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                            {note ? 'Edit Note' : 'Create New Note'}
                        </h2>
                        <p className="text-sm text-blue-100">
                            {note
                                ? 'Update your note'
                                : 'Capture your thoughts'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            className="border bg-red-400 border-white/30 text-white hover:bg-red-500/70"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={
                                !title.trim() || !content.trim() || !hasChanges
                            }
                            className="bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-800 hover:to-blue-600 text-white shadow-md"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Note
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                {/* Title */}
                <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                        Title *
                    </label>
                    <Input
                        placeholder="Enter note title..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="text-lg h-12 bg-background border-border focus:border-0 focus:ring-0 "
                    />
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category */}
                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full h-10 px-3 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            title="Category"
                        >
                            <option value="">Select category...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Author */}
                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                            Author
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Author name"
                                value={author}
                                onChange={e => setAuthor(e.target.value)}
                                className="pl-10 bg-background border-border focus:border-0 focus:ring-0"
                            />
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                        Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="bg-gradient-warm text-primary-foreground cursor-pointer hover:bg-gradient-primary"
                                onClick={() => handleRemoveTag(tag)}
                            >
                                {tag}
                                <X className="w-3 h-3 ml-1" />
                            </Badge>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a tag..."
                            value={newTag}
                            onChange={e => setNewTag(e.target.value)}
                            onKeyDown={e => handleKeyPress(e, handleAddTag)}
                            className="flex-1 bg-background border-border focus:border-0 focus:ring-0"
                        />
                        <Button
                            onClick={handleAddTag}
                            disabled={
                                !newTag.trim() || tags.includes(newTag.trim())
                            }
                            variant="outline"
                            className="border-border bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Add
                        </Button>
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                        Image
                    </label>
                    {imageError && (
                        <div className="text-red-500 text-sm mb-2">
                            {imageError}
                        </div>
                    )}
                    {imageUrl ? (
                        <div className="space-y-3">
                            <div className="relative inline-block">
                                <img
                                    src={imageUrl}
                                    alt="Note image"
                                    className="max-w-xs h-32 object-cover rounded-lg border border-border"
                                />
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                                disabled={uploading}
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer flex flex-col items-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                        <span className="text-sm text-muted-foreground">
                                            Uploading...
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Image className="w-8 h-8 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Click to upload an image
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            JPG, PNG, GIF up to 10MB
                                        </span>
                                    </>
                                )}
                            </label>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                        Content *
                    </label>
                    <Textarea
                        placeholder="Write your note content here..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={12}
                        className="resize-none bg-background border-border focus:border-0 focus:ring-0 text-base leading-relaxed"
                    />
                </div>

                {/* Metadata Display */}
                {note && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                                Created:{' '}
                                {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                                Updated:{' '}
                                {new Date(note.updatedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
