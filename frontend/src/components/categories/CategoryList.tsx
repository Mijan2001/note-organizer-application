import { useCategories } from '../../hooks/useCategories';

export default function CategoryList() {
    const { categories, loading } = useCategories();

    if (loading) return <div>Loading categories...</div>;

    return (
        <div>
            <h2>All Categories</h2>
            <ul>
                {categories.map(cat => (
                    <li key={cat._id}>{cat.name}</li>
                ))}
            </ul>
        </div>
    );
}
