import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { type Note, type User as UserType } from '@/types';

interface NoteCardProps {
    note: Note;
    onClick?: () => void;
    className?: string;
    user: UserType | null;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const NoteCard = ({
    note,
    onClick,
    onEdit,
    onDelete
}: NoteCardProps) => {
    console.log('notes form note-card.tsx===', note);

    console.log('onEdit from note-card.tsx=== ', onEdit);
    console.log('onDelete from note-card.tsx=== ', onDelete);

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    console.log('user from note-card.tsx=== ', user);
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // const truncateContent = (content: string, maxLength: number = 120) => {
    //     return content.length <= maxLength
    //         ? content
    //         : content.substring(0, maxLength) + '...';
    // };

    return (
        <Card
            onClick={onClick}
            className="group max-w-full h-[380px] flex flex-col justify-between transition-all duration-300 ease-in-out cursor-pointer
        hover:shadow-xl hover:scale-[1.015] border border-gray-200 rounded-md overflow-hidden bg-white dark:bg-zinc-900"
        >
            {/* Card Header */}
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-white group-hover:text-primary transition-colors">
                        {note?.title}
                    </h3>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium text-xs px-2 py-0.5 rounded-full">
                        {note?.category?.name}
                    </Badge>
                </div>

                {/* Edit/Delete Buttons */}
                {user && note?.user?._id === user?._id && (
                    <div className="flex gap-3 mt-4">
                        <button
                            className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 dark:text-white transition"
                            onClick={e => {
                                e.stopPropagation();
                                onEdit && onEdit();
                            }}
                        >
                            ✏️ Edit
                        </button>

                        <button
                            className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 dark:text-white transition"
                            onClick={e => {
                                e.stopPropagation();
                                onDelete && onDelete();
                            }}
                        >
                            🗑️ Delete
                        </button>
                    </div>
                )}
            </CardHeader>

            {/* Card Content */}
            <CardContent className="px-4 pb-4 pt-2 overflow-hidden">
                {/* Optional Image */}
                {note?.imageUrl && (
                    <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                        <img
                            src={note.imageUrl}
                            alt="Note"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                )}

                {/* Content Preview */}
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3 line-clamp-3">
                    {note?.content}
                </p>

                {/* Metadata */}
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{note?.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(note.updatedAt)}</span>
                    </div>
                </div>

                {/* Tags */}
                {Array.isArray(note?.tags) && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {note.tags.slice(0, 3).map((tag, i) => (
                            <Badge
                                key={i}
                                variant="outline"
                                className="text-xs bg-purple-100 hover:bg-purple-200 dark:bg-purple-800 dark:hover:bg-purple-700 text-purple-700 dark:text-white rounded-full px-2 py-0.5"
                            >
                                {tag}
                            </Badge>
                        ))}
                        {note.tags.length > 3 && (
                            <Badge
                                variant="outline"
                                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white rounded-full px-2 py-0.5"
                            >
                                +{note.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
