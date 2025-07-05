import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface NoteType {
    _id: string;
    title: string;
    content: string;
    category?: { _id: string; name: string } | string;
    user?: { _id: string; username: string };
}

interface FormType {
    title: string;
    content: string;
    category: string;
}

export default function NoteDetails() {
    const { id } = useParams();
    const [note, setNote] = useState<NoteType | null>(null);
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<FormType>({
        title: '',
        content: '',
        category: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetch(`${API_URL}/api/notes/${id}`)
            .then(res => res.json())
            .then((data: NoteType) => {
                setNote(data);
                setForm({
                    title: data.title || '',
                    content: data.content || '',
                    category:
                        typeof data.category === 'object' && data.category
                            ? data.category._id
                            : ''
                });
            });
    }, [id]);

    useEffect(() => {
        // If URL has ?edit=1, open edit mode

        if (location.search.includes('edit=1')) setEditing(true);
    }, [location.search]);

    if (!note) return <div>Loading...</div>;

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        if (!window.confirm('Are you sure?')) return;
        const res = await fetch(`${API_URL}/api/notes/${note._id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) navigate('/');
        else alert('Delete failed');
    };

    const handleEdit = () => setEditing(true);

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/notes/${note._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });
        setLoading(false);
        if (res.ok) {
            const updated = await res.json();
            setNote(updated);
            setEditing(false);
        } else {
            alert('Update failed');
        }
    };

    if (editing) {
        return (
            <div>
                <h2>Edit Note</h2>
                <form onSubmit={handleFormSubmit}>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleFormChange}
                            required
                            placeholder="Enter title"
                            title="Title"
                        />
                    </div>
                    <div>
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            name="content"
                            value={form.content}
                            onChange={handleFormChange}
                            required
                            placeholder="Enter content"
                            title="Content"
                        />
                    </div>
                    <div>
                        <label htmlFor="category">Category</label>
                        <input
                            id="category"
                            name="category"
                            value={form.category}
                            onChange={handleFormChange}
                            placeholder="Category ID"
                            title="Category"
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" onClick={() => setEditing(false)}>
                        Cancel
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <p>
                Category:{' '}
                {typeof note.category === 'object' && note.category
                    ? note.category.name
                    : note.category}
            </p>
            <p>Author: {note.user?.username}</p>
            {user && user._id === note.user?._id && (
                <>
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </>
            )}
        </div>
    );
}
