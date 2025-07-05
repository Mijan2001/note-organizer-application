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

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalNotes, setTotalNotes] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // On mount, check for token and user
    useEffect(() => {
        const t = localStorage.getItem('token');
        const u = localStorage.getItem('user');
        console.log('t ===', t);
        console.log('u ===', u);
        if (t && u) {
            setToken(t);
            setUser(u);
        }
    }, []);

    // Fetch notes with pagination
    const fetchNotes = async (
        page: number = 1,
        search: string = '',
        category: string | null = null
    ) => {
        setIsLoading(true);
        try {
            let url = `${API_URL}/api/notes?page=${page}&limit=6`;

            if (search.trim()) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            if (category) {
                const categoryObj = categories.find(
                    cat => cat._id === category
                );
                if (categoryObj) {
                    url += `&category=${categoryObj._id}`;
                }
            }

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setNotes(Array.isArray(data.notes) ? data.notes : []);
                setTotalNotes(data.total || 0);
                setTotalPages(Math.ceil((data.total || 0) / 6));
            } else {
                console.error('Failed to fetch notes:', data);
                toast({
                    title: 'Error',
                    description: 'Failed to fetch notes. Please try again.',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
            toast({
                title: 'Error',
                description: 'Network error. Please check your connection.',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/api/categories/`);
            const data = await response.json();
            if (response.ok) {
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch notes when dependencies change
    useEffect(() => {
        fetchNotes(currentPage, searchQuery, selectedCategory);
    }, [currentPage, searchQuery, selectedCategory, token]);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle search change
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Handle category change
    const handleCategoryChange = (categoryId: string | null) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1); // Reset to first page when changing category
    };

    console.log('categories === from index.tsx========= ', categories);
    console.log(
        'selectedCategory === from index.tsx ========= ',
        selectedCategory
    );

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
        console.log('node ======: ', note);
        console.log('user =====', user);

        if (user && note.author.toUpperCase() === user) {
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
            console.log('editingNote ====== index.tsx===', editingNote);
            const res = await fetch(
                `${API_URL}/api/notes/${editingNote?._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedNote)
                }
            );
            if (res.ok) {
                // Refresh current page data
                await fetchNotes(currentPage, searchQuery, selectedCategory);
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
                // Refresh current page data
                await fetchNotes(currentPage, searchQuery, selectedCategory);
                setIsEditing(false);
                setEditingNote(undefined);
                toast({
                    title: 'Note created',
                    description: `"${noteData.title}" was created successfully.`
                });
            } else {
                // handle error
            }
        }
    };

    // Add category to backend
    const handleAddCategory = async (name: string) => {
        console.log('handleAddCategory called with name:=====', name);
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
            toast({
                title: 'Category creation failed. Only logged in users can create categories.',
                description: 'Could not create the category. Please try again.'
            });
        }
    };

    // Handle login success
    const handleLoginSuccess = (userEmail: string) => {
        setUser(userEmail);
        localStorage.setItem('user', JSON.stringify(userEmail));
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
        const res = await fetch(`${API_URL}/api/notes/${note._id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            // Refresh current page data
            await fetchNotes(currentPage, searchQuery, selectedCategory);
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
                onSearch={handleSearchChange}
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
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
                                    onCategorySelect={handleCategoryChange}
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
                                                                  cat._id ===
                                                                  selectedCategory
                                                          )?.name
                                                      } Notes`
                                                    : 'All Notes'}
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                {totalNotes}{' '}
                                                {totalNotes === 1
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
                                                    setCurrentPage(1);
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
                                notes={notes}
                                onNoteClick={handleNoteClick}
                                onCreateNote={handleCreateNote}
                                loading={isLoading}
                                user={user}
                                onEdit={note => {
                                    setEditingNote(note);
                                    setIsEditing(true);
                                }}
                                onDelete={handleDeleteNote}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalNotes={totalNotes}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
