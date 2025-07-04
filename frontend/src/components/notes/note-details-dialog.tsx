import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { type Note } from '@/components/ui/note-card';

interface NoteDetailsDialogProps {
    note?: Note;
    onClose: () => void;
}

export function NoteDetailsDialog({ note, onClose }: NoteDetailsDialogProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    &times;
                </button>
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-bold">{note.title}</h2>
                        <p className="text-sm text-muted-foreground">
                            {note?.category}
                        </p>
                    </CardHeader>
                    <CardContent>
                        {note?.imageUrl && (
                            <img
                                src={note?.imageUrl}
                                alt="Note"
                                className="mb-4 rounded"
                            />
                        )}
                        <p className="mb-4 whitespace-pre-line">
                            {note?.content}
                        </p>
                        <div className="text-xs text-muted-foreground space-y-1">
                            <div>Author: {note?.author}</div>
                            <div>
                                Created:{' '}
                                {new Date(note?.createdAt).toLocaleString()}
                            </div>
                            <div>
                                Updated:{' '}
                                {new Date(note?.updatedAt).toLocaleString()}
                            </div>
                            {note?.tags && note.tags.length > 0 && (
                                <div>Tags: {note.tags.join(', ')}</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
