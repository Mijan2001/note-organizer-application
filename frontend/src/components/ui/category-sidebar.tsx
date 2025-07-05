import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Search, Plus, X } from 'lucide-react';

export interface Category {
    _id?: string;
    id?: string;
    name: string;
    count: number;
    color?: string;
}

interface CategorySidebarProps {
    categories: Category[];
    selectedCategory: string | null;
    onCategorySelect: (categoryId: string | null) => void;
    onAddCategory?: (name: string) => void;
    className?: string;
}

export const CategorySidebar = ({
    categories,
    selectedCategory,
    onCategorySelect,
    onAddCategory,
    className
}: CategorySidebarProps) => {
    console.log('categories===from sidebar == ', categories);
    console.log('selectedCategory=== from sidebar === ', selectedCategory);

    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log('filteredCategories==', filteredCategories);

    const handleAddCategory = () => {
        if (newCategoryName.trim() && onAddCategory) {
            onAddCategory(newCategoryName.trim());
            setNewCategoryName('');
            setIsAddingCategory(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddCategory();
        } else if (e.key === 'Escape') {
            setIsAddingCategory(false);
            setNewCategoryName('');
        }
    };

    return (
        <Card
            className={cn(
                'h-full bg-gradient-to-br from-white via-slate-50 to-slate-100 border border-slate-200 shadow-lg rounded-xl',
                className
            )}
        >
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                        Categories
                    </h2>

                    {/* Search */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-9 bg-white text-gray-800 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {/* Add Category Button */}
                    {!isAddingCategory && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddingCategory(true)}
                            className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border border-indigo-300 rounded-md"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Category
                        </Button>
                    )}

                    {/* Add Category Input */}
                    {isAddingCategory && (
                        <div className="flex gap-2 mt-2">
                            <Input
                                placeholder="Category name"
                                value={newCategoryName}
                                onChange={e =>
                                    setNewCategoryName(e.target.value)
                                }
                                onKeyDown={handleKeyPress}
                                className="bg-white border border-gray-400 focus:ring-indigo-400 rounded"
                                autoFocus
                            />
                            <Button
                                size="sm"
                                onClick={handleAddCategory}
                                disabled={!newCategoryName.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setIsAddingCategory(false);
                                    setNewCategoryName('');
                                }}
                                className="border-gray-300 text-gray-600 hover:bg-gray-100"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* All Notes Option */}
                <div className="mb-4">
                    <Button
                        variant={
                            selectedCategory === null ? 'default' : 'ghost'
                        }
                        className={cn(
                            'w-full justify-start transition-all duration-200 rounded-lg',
                            selectedCategory === null
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow'
                                : 'text-gray-800 hover:bg-gray-100'
                        )}
                        onClick={() => onCategorySelect(null)}
                    >
                        <span className="flex-1 text-left">All Notes</span>
                        <Badge
                            className={cn(
                                'ml-2',
                                selectedCategory === null
                                    ? 'bg-white text-indigo-600'
                                    : 'bg-slate-200 text-slate-700'
                            )}
                        >
                            {categories.reduce(
                                (total, cat) => total + cat.count,
                                0
                            )}
                        </Badge>
                    </Button>
                </div>

                {/* Categories List */}
                <div className="space-y-2">
                    {filteredCategories.map(category => (
                        <Button
                            key={category._id}
                            variant={
                                selectedCategory === category._id
                                    ? 'default'
                                    : 'ghost'
                            }
                            className={cn(
                                'w-full justify-start rounded-lg group transition-all duration-200',
                                selectedCategory === category._id
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                                    : 'hover:bg-gray-100 text-gray-800'
                            )}
                            onClick={() =>
                                onCategorySelect(category._id || null)
                            }
                        >
                            <span className="flex-1 text-left truncate">
                                {category.name}
                            </span>
                            <Badge
                                className={cn(
                                    'ml-2 transition-colors',
                                    selectedCategory === category?._id
                                        ? 'bg-white text-indigo-600'
                                        : 'bg-gray-200 text-gray-700 group-hover:bg-indigo-100'
                                )}
                            >
                                {category.count}
                            </Badge>
                        </Button>
                    ))}
                </div>

                {/* Empty State */}
                {filteredCategories.length === 0 && searchTerm && (
                    <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">No categories found</p>
                        <p className="text-xs mt-1">
                            Try a different search term
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
};
