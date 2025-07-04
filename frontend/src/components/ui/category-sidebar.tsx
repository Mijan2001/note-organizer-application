import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Search, Plus, X } from 'lucide-react';

export interface Category {
    id: string;
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
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                'h-full bg-gradient-subtle border-border shadow-card',
                className
            )}
        >
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-3 bg-gradient-primary bg-clip-text text-transparent">
                        Categories
                    </h2>

                    {/* Search */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-9 bg-background border-border focus:ring-primary"
                        />
                    </div>

                    {/* Add Category Button */}
                    {!isAddingCategory && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddingCategory(true)}
                            className="w-full bg-gradient-warm hover:bg-gradient-primary text-primary-foreground border-primary/20"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Category
                        </Button>
                    )}

                    {/* Add Category Input */}
                    {isAddingCategory && (
                        <div className="flex gap-2">
                            <Input
                                placeholder="Category name"
                                value={newCategoryName}
                                onChange={e =>
                                    setNewCategoryName(e.target.value)
                                }
                                onKeyDown={handleKeyPress}
                                className="bg-background border-border focus:ring-primary"
                                autoFocus
                            />
                            <Button
                                size="sm"
                                onClick={handleAddCategory}
                                disabled={!newCategoryName.trim()}
                                className="bg-gradient-primary hover:bg-gradient-warm"
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
                            'w-full justify-start transition-all duration-200',
                            selectedCategory === null
                                ? 'bg-gradient-primary text-primary-foreground shadow-card'
                                : 'hover:bg-secondary text-foreground'
                        )}
                        onClick={() => onCategorySelect(null)}
                    >
                        <span className="flex-1 text-left">All Notes</span>
                        <Badge variant="secondary" className="ml-2 bg-muted">
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
                            key={category.id}
                            variant={
                                selectedCategory === category.id
                                    ? 'default'
                                    : 'ghost'
                            }
                            className={cn(
                                'w-full justify-start transition-all duration-200 group',
                                selectedCategory === category.id
                                    ? 'bg-gradient-primary text-primary-foreground shadow-card'
                                    : 'hover:bg-secondary text-foreground hover:shadow-sm'
                            )}
                            onClick={() => onCategorySelect(category.id)}
                        >
                            <span className="flex-1 text-left truncate">
                                {category.name}
                            </span>
                            <Badge
                                variant={
                                    selectedCategory === category.id
                                        ? 'secondary'
                                        : 'outline'
                                }
                                className={cn(
                                    'ml-2 transition-colors',
                                    selectedCategory === category.id
                                        ? 'bg-primary-light text-primary-foreground'
                                        : 'bg-muted group-hover:bg-accent'
                                )}
                            >
                                {category.count}
                            </Badge>
                        </Button>
                    ))}
                </div>

                {filteredCategories.length === 0 && searchTerm && (
                    <div className="text-center py-8 text-muted-foreground">
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
