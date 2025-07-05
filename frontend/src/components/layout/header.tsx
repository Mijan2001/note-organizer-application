import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/search-bar';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, User2 } from 'lucide-react';

interface User {
    username: string;
    email: string;
    _id: string;
}

interface HeaderProps {
    onCreateNote: () => void;
    onCreateLogin: () => void;
    onSearch: (query: string) => void;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    className?: string;
    user?: User | null;
    onLogout?: () => void;
}

export const Header = ({
    onCreateNote,
    onCreateLogin,
    onSearch,
    searchValue,
    onSearchChange,
    className,
    user,
    onLogout
}: HeaderProps) => {
    return (
        <header
            className={cn(
                'sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm',
                className
            )}
        >
            <div className="container mx-auto px-4 md:px-6 py-4">
                {/* Top section (Logo + User/Actions) */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    {/* Logo/Title */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">
                                N
                            </span>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                                Note Organizer
                            </h1>
                            <p className="text-sm text-gray-500">
                                Organize your thoughts beautifully
                            </p>
                        </div>
                    </div>

                    {/* Buttons/User */}
                    <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3">
                        <Button
                            onClick={onCreateNote}
                            className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-purple-500 hover:to-pink-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Note
                        </Button>

                        {user ? (
                            <>
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-violet-500 text-white font-semibold">
                                        {user?.username
                                            ?.charAt(0)
                                            .toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={onLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md hover:shadow-lg"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={onCreateLogin}
                                variant="outline"
                                size="icon"
                                className="bg-gradient-to-tr from-indigo-500 to-blue-500 hover:from-purple-500 hover:to-pink-500 text-white border-none shadow-md hover:shadow-lg"
                            >
                                <User2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <SearchBar
                    onSearch={onSearch}
                    placeholder="Search your notes..."
                    value={searchValue}
                    onChange={onSearchChange}
                    className="w-full rounded-md shadow-sm transition"
                />
            </div>
        </header>
    );
};
