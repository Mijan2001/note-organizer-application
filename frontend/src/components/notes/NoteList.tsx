import { useState } from 'react';
import { useNotes } from '../../hooks/useNotes';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function NoteList() {
    const [page, setPage] = useState(1);
    const { notes, total, loading } = useNotes(page, 10);
    const { user } = useAuth();
    const navigate = useNavigate();

    if (loading) return <div>Loading notes...</div>;

    const handleDelete = async id => {
        const token = localStorage.getItem('token');
        if (!window.confirm('Are you sure?')) return;
        const res = await fetch(`/api/notes/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) window.location.reload();
        else alert('Delete failed');
    };

    const handleEdit = id => {
        navigate(`/notes/${id}?edit=1`);
    };

    return (
        <div>
            <h2>All Notes</h2>
            <ul>
                {notes.map(note => (
                    <li key={note._id}>
                        <Link to={`/notes/${note._id}`}>
                            <strong>{note.title}</strong>
                        </Link>
                        {user && user._id === note.user?._id && (
                            <>
                                <button onClick={() => handleEdit(note._id)}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(note._id)}>
                                    Delete
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <div>
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                >
                    Prev
                </button>
                <span>Page {page}</span>
                <button
                    disabled={page * 10 >= total}
                    onClick={() => setPage(p => p + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
