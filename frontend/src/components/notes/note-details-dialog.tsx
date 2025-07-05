import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { type Note } from '@/types';

interface NoteDetailsDialogProps {
    note?: Note;
    onClose: () => void;
}

export function NoteDetailsDialog({ note, onClose }: NoteDetailsDialogProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-xl">
                <button
                    className="absolute top-2 right-2 text-white hover:text-gray-600 text-2xl font-bold z-10"
                    onClick={onClose}
                >
                    &times;
                </button>

                <Card className="rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6">
                        <h2 className="text-2xl font-bold">{note?.title}</h2>
                        <p className="text-sm opacity-80">
                            {note?.category?.name}
                        </p>
                    </CardHeader>
                    {/* from-[#1e293b] via-[#0f172a] to-[#1e293b] */}
                    <CardContent className="p-6 space-y-4 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e293b] text-white rounded-b-2xl transition-colors duration-300">
                        {note?.imageUrl && (
                            <img
                                src={note.imageUrl}
                                alt="Note"
                                className="rounded-lg w-full max-h-60 object-cover hover:scale-[1.02] hover:shadow-lg transition-transform duration-300"
                            />
                        )}

                        <p className="text-base whitespace-pre-line text-gray-100 hover:text-white transition-colors duration-200">
                            {note?.content}
                        </p>

                        <div className="text-sm space-y-1">
                            <div className="hover:text-indigo-300 transition-colors duration-200">
                                <span className="font-medium text-indigo-400">
                                    Author:
                                </span>{' '}
                                {note?.author}
                            </div>
                            <div className="hover:text-purple-300 transition-colors duration-200">
                                <span className="font-medium text-purple-400">
                                    Created:
                                </span>{' '}
                                {note?.createdAt &&
                                    new Date(note.createdAt).toLocaleString()}
                            </div>
                            <div className="hover:text-pink-300 transition-colors duration-200">
                                <span className="font-medium text-pink-400">
                                    Updated:
                                </span>{' '}
                                {note?.updatedAt &&
                                    new Date(note.updatedAt).toLocaleString()}
                            </div>
                            {note?.tags && note.tags.length > 0 && (
                                <div className="hover:text-emerald-300 transition-colors duration-200">
                                    <span className="font-medium text-emerald-400">
                                        Tags:
                                    </span>{' '}
                                    {note.tags.join(', ')}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
