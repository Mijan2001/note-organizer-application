import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import {
    CategorySidebar,
    type Category
} from '@/components/ui/category-sidebar';
import { NoteGrid } from '@/components/notes/note-grid';
import { NoteEditor } from '@/components/notes/note-editor';
import { type Note } from '@/components/ui/note-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LoginDialog } from '@/components/auth/login';
import { RegisterDialog } from '@/components/auth/register';
import { NoteDetailsDialog } from '@/components/notes/note-details-dialog';
import { toast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL;

const Index = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | undefined>();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [detailsNote, setDetailsNote] = useState<Note | null>(null);

    // On mount, check for token and user
    useEffect(() => {
        const t = localStorage.getItem('token');
        const u = localStorage.getItem('user');
        if (t && u) {
            setToken(t);
            setUser(u);
        }
    }, []);

    // Fetch notes and categories from backend
    useEffect(() => {
        if (!token) return; // Don't fetch if not authenticated
        fetch(`${API_URL}/api/notes`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                console.log('data : ', data);
                setNotes(Array.isArray(data) ? data : data.notes || []);
            });

        fetch(`${API_URL}/api/categories`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(setCategories);
    }, [token]);

    // Filter notes based on category and search query
    useEffect(() => {
        let filtered = notes;
        if (selectedCategory) {
            const categoryName = categories.find(
                cat => cat.id === selectedCategory
            )?.name;
            if (categoryName) {
                filtered = filtered.filter(
                    note => note.category === categoryName
                );
            }
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                note =>
                    note.title.toLowerCase().includes(query) ||
                    note.content.toLowerCase().includes(query) ||
                    note.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }
        setFilteredNotes(filtered);
    }, [notes, selectedCategory, searchQuery, categories]);

    // Only allow note creation if logged in
    const handleCreateNote = () => {
        if (!user) {
            setShowLogin(true);
            return;
        }
        setEditingNote(undefined);
        setIsEditing(true);
    };

    const handleNoteClick = (note: Note) => {
        if (user && note.author === user) {
            setEditingNote(note);
            setIsEditing(true);
        } else {
            setDetailsNote(note);
            setShowDetails(true);
        }
    };

    // Save note to backend
    const handleSaveNote = async (
        noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
        if (!token) return;
        if (editingNote) {
            const now = new Date().toISOString();
            const updatedNote: Note = {
                ...editingNote,
                ...noteData,
                updatedAt: now
            };
            const res = await fetch(`${API_URL}/api/notes/${editingNote.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedNote)
            });
            if (res.ok) {
                const notesRes = await fetch(`${API_URL}/api/notes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const notesData = await notesRes.json();
                setNotes(
                    Array.isArray(notesData) ? notesData : notesData.notes || []
                );
                setIsEditing(false);
                setEditingNote(undefined);
            } else {
                // handle error
            }
        } else {
            // Only send required fields for new note
            const { title, content, category, author, tags, imageUrl } =
                noteData;
            const res = await fetch(`${API_URL}/api/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    content,
                    category,
                    author,
                    tags,
                    imageUrl
                })
            });
            if (res.ok) {
                const notesRes = await fetch(`${API_URL}/api/notes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const notesData = await notesRes.json();
                setNotes(
                    Array.isArray(notesData) ? notesData : notesData.notes || []
                );
                setIsEditing(false);
                setEditingNote(undefined);
            } else {
                // handle error
            }
        }
    };

    // Add category to backend
    const handleAddCategory = async (name: string) => {
        if (!token) return;
        const res = await fetch(`${API_URL}/api/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        });
        if (res.ok) {
            const cats = await fetch(`${API_URL}/api/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(await cats.json());
        } else {
            // handle error
        }
    };

    // Handle login success
    const handleLoginSuccess = (userEmail: string) => {
        setUser(userEmail);
        localStorage.setItem('user', userEmail);
        const t = localStorage.getItem('token');
        if (t) setToken(t);
    };

    // Logout
    const handleLogout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // Delete note from backend
    const handleDeleteNote = async (note: Note) => {
        if (!token) return;
        if (!window.confirm('Are you sure you want to delete this note?'))
            return;
        const res = await fetch(`${API_URL}/api/notes/${note.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            setNotes(notes.filter(n => n.id !== note.id));
            toast({
                title: 'Note deleted',
                description: `"${note.title}" was deleted successfully.`
            });
        } else {
            toast({
                title: 'Delete failed',
                description: 'Could not delete the note. Please try again.'
            });
        }
    };

    if (isEditing) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-6 py-8">
                    <NoteEditor
                        note={editingNote}
                        categories={categories}
                        onSave={handleSaveNote}
                        onCancel={() => {
                            setIsEditing(false);
                            setEditingNote(undefined);
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  bg-background">
            <Header
                onCreateNote={handleCreateNote}
                onCreateLogin={() => setShowLogin(true)}
                onSearch={setSearchQuery}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                user={user}
                onLogout={handleLogout}
            />
            {showLogin && (
                <LoginDialog
                    onClose={() => setShowLogin(false)}
                    onRegister={() => {
                        setShowLogin(false);
                        setShowRegister(true);
                    }}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
            {showRegister && (
                <RegisterDialog
                    onClose={() => setShowRegister(false)}
                    onLogin={() => {
                        setShowRegister(false);
                        setShowLogin(true);
                    }}
                />
            )}
            {showDetails && detailsNote && (
                <NoteDetailsDialog
                    note={detailsNote}
                    onClose={() => setShowDetails(false)}
                />
            )}
            <div className="container mx-auto p-2 md:px-6 md:py-6">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <div
                        className={`transition-all duration-300 ${
                            sidebarCollapsed ? 'w-0' : 'w-80'
                        } shrink-0`}
                    >
                        {!sidebarCollapsed && (
                            <div className="sticky top-32">
                                <CategorySidebar
                                    categories={categories}
                                    selectedCategory={selectedCategory}
                                    onCategorySelect={setSelectedCategory}
                                    onAddCategory={handleAddCategory}
                                />
                            </div>
                        )}
                    </div>
                    {/* Sidebar Toggle */}
                    <div className="flex flex-col">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setSidebarCollapsed(!sidebarCollapsed)
                            }
                            className="mb-4 w-10 hover:bg-secondary"
                        >
                            {sidebarCollapsed ? (
                                <ChevronRight className="w-4 h-4" />
                            ) : (
                                <ChevronLeft className="w-4 h-4" />
                            )}
                        </Button>
                        {/* Main Content */}
                        <div className="flex-1 ">
                            {/* Results Header */}
                            <div className="mb-6">
                                <Card className="p-4 bg-gradient-subtle border-border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-foreground">
                                                {selectedCategory
                                                    ? `${
                                                          categories.find(
                                                              cat =>
                                                                  cat.id ===
                                                                  selectedCategory
                                                          )?.name
                                                      } Notes`
                                                    : 'All Notes'}
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                {filteredNotes.length}{' '}
                                                {filteredNotes.length === 1
                                                    ? 'note'
                                                    : 'notes'}{' '}
                                                found
                                                {searchQuery &&
                                                    ` for "${searchQuery}"`}
                                            </p>
                                        </div>
                                        {(selectedCategory || searchQuery) && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedCategory(null);
                                                    setSearchQuery('');
                                                }}
                                                className="border-border hover:bg-secondary"
                                            >
                                                Clear Filters
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            </div>
                            {/* Notes Grid */}
                            <NoteGrid
                                notes={filteredNotes}
                                onNoteClick={handleNoteClick}
                                onCreateNote={handleCreateNote}
                                loading={!token && notes.length === 0}
                                user={user}
                                onEdit={note => {
                                    setEditingNote(note);
                                    setIsEditing(true);
                                }}
                                onDelete={handleDeleteNote}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
