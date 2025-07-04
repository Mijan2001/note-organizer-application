import { type Note } from '@/components/ui/note-card';
import { NoteCard } from '@/components/ui/note-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Plus, FileText } from 'lucide-react';

interface NoteGridProps {
    notes: Note[];
    onNoteClick: (note: Note) => void;
    onCreateNote: () => void;
    loading?: boolean;
    className?: string;
    user?: string | null;
    onEdit?: (note: Note) => void;
    onDelete?: (note: Note) => void;
}

export const NoteGrid = ({
    notes,
    onNoteClick,
    onCreateNote,
    loading = false,
    className,
    user,
    onEdit,
    onDelete
}: NoteGridProps) => {
    if (loading) {
        return (
            <div
                className={cn(
                    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
                    className
                )}
            >
                {Array.from({ length: 8 }).map((_, index) => (
                    <Card
                        key={index}
                        className="h-[350px] animate-pulse bg-slate-100 rounded-lg shadow-sm"
                    />
                ))}
            </div>
        );
    }

    if (notes.length === 0) {
        return (
            <div
                className={cn(
                    'flex flex-col items-center justify-center py-16',
                    className
                )}
            >
                <div className="text-center space-y-4 max-w-md">
                    <div className="w-24 h-24 bg-gradient-to-tr from-slate-200 to-slate-100 rounded-full flex items-center justify-center mx-auto shadow-md">
                        <FileText className="w-12 h-12 text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-800">
                        No notes yet
                    </h3>
                    <p className="text-slate-500">
                        Start organizing your thoughts by creating your first
                        note.
                    </p>
                    <Button
                        onClick={onCreateNote}
                        className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-blue-600 hover:to-purple-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Note
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6',
                'animate-fade-in',
                className
            )}
        >
            {notes?.map((note, index) => (
                <div
                    key={note.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    className="animate-scale-in flex"
                >
                    <div className="flex flex-col w-full h-full ">
                        <NoteCard
                            note={note}
                            onClick={() => onNoteClick(note)}
                            className="flex flex-col h-full"
                            user={user}
                            onEdit={() => onEdit && onEdit(note)}
                            onDelete={() => onDelete && onDelete(note)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};
