import { useEffect, useState } from 'react';

export function useNotes(page = 1, limit = 10) {
    const [notes, setNotes] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/notes?page=${page}&limit=${limit}`)
            .then(res => res.json())
            .then(data => {
                setNotes(data.notes || []);
                setTotal(data.total || 0);
                setLoading(false);
            });
    }, [page, limit]);

    return { notes, total, loading };
}
