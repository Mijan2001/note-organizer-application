import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar, User } from 'lucide-react';

export interface Note {
    id: string;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    author: string;
    tags?: string[];
    imageUrl?: string;
}

interface NoteCardProps {
    note: Note;
    onClick?: () => void;
    className?: string;
    user?: string | null;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const NoteCard = ({
    note,
    onClick,
    className,
    user,
    onEdit,
    onDelete
}: NoteCardProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const truncateContent = (content: string, maxLength: number = 120) => {
        return content.length <= maxLength
            ? content
            : content.substring(0, maxLength) + '...';
    };

    return (
        <Card
            onClick={onClick}
            className="group w-60 transition-all duration-300 ease-in-out cursor-pointer
                hover:shadow-xl hover:scale-[1.01]
                border border-border shadow-sm rounded-2xl overflow-hidden bg-card"
            // className={cn(
            //     'group transition-all duration-300 ease-in-out cursor-pointer',
            //     'hover:shadow-xl hover:scale-[1.01]',
            //     'border border-border shadow-sm rounded-2xl overflow-hidden bg-card',
            //     className
            // )}
        >
            {/* Card Header */}
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                        {note.title}
                    </h3>
                    <Badge className="bg-primary/10 text-primary font-medium text-xs px-2 py-0.5 rounded-full">
                        {note.category}
                    </Badge>
                </div>
                {/* Edit/Delete Buttons */}
                {user && note.author === user && (
                    <div className="flex gap-2 mt-2">
                        <button
                            className="text-xs text-blue-600 hover:underline"
                            onClick={e => {
                                e.stopPropagation();
                                onEdit && onEdit();
                            }}
                        >
                            Edit
                        </button>
                        <button
                            className="text-xs text-red-600 hover:underline"
                            onClick={e => {
                                e.stopPropagation();
                                onDelete && onDelete();
                            }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </CardHeader>

            {/* Card Content */}
            <CardContent className="px-2 pb-4 pt-2">
                {/* Optional Image */}
                {note.imageUrl && (
                    <div className="w-full h-36 rounded-xl overflow-hidden mb-4">
                        <img
                            src={note.imageUrl}
                            alt="Note"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                )}

                {/* Content Preview */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {truncateContent(note.content)}
                </p>

                {/* Metadata */}
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{note.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(note.updatedAt)}</span>
                    </div>
                </div>

                {/* Tags */}
                {Array.isArray(note.tags) && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {note.tags.slice(0, 3).map((tag, i) => (
                            <Badge
                                key={i}
                                variant="outline"
                                className="text-xs bg-purple-200 hover:bg-purple-300 rounded-full px-2 py-0.5"
                            >
                                {tag}
                            </Badge>
                        ))}
                        {note.tags.length > 3 && (
                            <Badge
                                variant="outline"
                                className="text-xs rounded-full px-2 py-0.5"
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
