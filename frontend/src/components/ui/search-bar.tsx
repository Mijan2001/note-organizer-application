import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
}

export const SearchBar = ({
    onSearch,
    placeholder = 'Search notes...',

    value: controlledValue,
    onChange
}: SearchBarProps) => {
    const [internalValue, setInternalValue] = useState('');

    const value =
        controlledValue !== undefined ? controlledValue : internalValue;
    const setValue = onChange || setInternalValue;

    const handleSearch = () => {
        onSearch(value);
    };

    const handleClear = () => {
        setValue('');
        onSearch('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                    placeholder={placeholder}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="pl-10 pr-10 h-12 text-lg border-border transition-all duration-200"
                />
                {value && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>
            <Button
                onClick={handleSearch}
                className="h-12 px-6 rounded-r-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
             hover:from-pink-500 hover:to-yellow-500 
             text-white shadow-md shadow-purple-300 transition-all duration-300 ease-in-out"
            >
                Search
            </Button>
        </div>
    );
};
