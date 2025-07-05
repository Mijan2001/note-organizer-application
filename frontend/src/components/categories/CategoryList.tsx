import { useCategories } from '../../hooks/useCategories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type Category = {
    _id: string;
    name: string;
};

export default function CategoryList() {
    const { categories, loading } = useCategories() as {
        categories: Category[];
        loading: boolean;
    };

    if (loading) {
        return (
            <Card className="max-w-md mx-auto mt-8">
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-6 w-32" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <li key={i}>
                                <Skeleton className="h-5 w-full" />
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-md mx-auto mt-8 bg-white border border-gray-200 rounded-xl shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-6">
                <CardTitle className="text-white text-2xl font-semibold tracking-tight">
                    All Categories
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-b-xl">
                <ul className="space-y-3">
                    {categories.map(cat => (
                        <li
                            key={cat._id}
                            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-800 font-medium shadow-sm hover:bg-blue-100 hover:shadow-md transition duration-200 cursor-pointer"
                        >
                            {cat.name}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
