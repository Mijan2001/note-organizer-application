import { type Note } from '@/components/ui/note-card';
import { NoteCard } from '@/components/ui/note-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { Plus, FileText } from 'lucide-react';

interface NoteGridProps {
    notes: Note[];
    _id?: string;
    onNoteClick: (note: Note) => void;
    onCreateNote: () => void;
    loading?: boolean;
    className?: string;
    user?: string | null;
    onEdit?: (note: Note) => void;
    onDelete?: (note: Note) => void;
    // Pagination props
    currentPage?: number;
    totalPages?: number;
    totalNotes?: number;
    onPageChange?: (page: number) => void;
}

export const NoteGrid = ({
    notes,
    onNoteClick,
    onCreateNote,
    loading = false,
    className,
    user,
    onEdit,
    onDelete,
    currentPage = 1,
    totalPages = 1,
    totalNotes = 0,
    onPageChange
}: NoteGridProps) => {
    // console.log('notes from NoteGrid component:=========', notes);

    if (loading) {
        return (
            <div className="space-y-6">
                <div
                    className={cn(
                        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4',
                        className
                    )}
                >
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Card
                            key={index}
                            className="h-[250px] border-none w-[250px] animate-pulse bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl shadow-md p-4 space-y-4"
                        >
                            <div className="h-40 bg-slate-400 rounded-xl" />
                            <div className="h-6 bg-slate-400 rounded-md w-3/4" />
                            <div className="h-4 bg-slate-400 rounded-md w-1/2" />
                            <div className="h-4 bg-slate-400 rounded-md w-2/3" />
                        </Card>
                    ))}
                </div>
                {/* Loading pagination skeleton */}
                <div className="flex justify-center py-4">
                    <div className="flex space-x-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="w-8 h-8 bg-slate-200 rounded animate-pulse"
                            />
                        ))}
                    </div>
                </div>
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
        <div className="space-y-6">
            {/* Notes Grid */}
            <div
                className={cn(
                    'flex flex-wrap gap-2 md:gap-6 justify-start',
                    'animate-fade-in',
                    className
                )}
            >
                {notes?.map((note, index) => (
                    <div
                        key={note._id ?? note.id ?? index}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        className="animate-scale-in flex w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
                    >
                        <div className="flex flex-col w-full h-full">
                            <NoteCard
                                note={note}
                                onClick={() => onNoteClick(note)}
                                className="flex flex-col h-[400px] overflow-hidden"
                                user={user}
                                onEdit={() => onEdit && onEdit(note)}
                                onDelete={() => onDelete && onDelete(note)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && onPageChange && (
                <div className="flex flex-col items-center space-y-4 py-6">
                    {/* Results info */}
                    <div className="text-sm text-gray-600 text-center">
                        Showing {(currentPage - 1) * 6 + 1} to{' '}
                        {Math.min(currentPage * 6, totalNotes)} of {totalNotes}{' '}
                        notes
                    </div>

                    {/* Pagination component */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        className="mt-4"
                    />
                </div>
            )}
        </div>
    );
};
