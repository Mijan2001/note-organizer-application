import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    className
}: PaginationProps) => {
    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    const visiblePages = getVisiblePages();

    return (
        <div
            className={cn(
                'flex items-center justify-center space-x-2',
                className
            )}
        >
            {/* Previous Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 hover:bg-indigo-50 border-indigo-200 text-indigo-700"
            >
                <ChevronLeft className="w-4 h-4" />
                Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
                {visiblePages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <div
                                key={`dots-${index}`}
                                className="flex items-center justify-center w-8 h-8"
                            >
                                <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </div>
                        );
                    }

                    return (
                        <Button
                            key={page}
                            variant={
                                currentPage === page ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => onPageChange(page as number)}
                            className={cn(
                                'w-8 h-8 p-0',
                                currentPage === page
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                                    : 'hover:bg-indigo-50 border-indigo-200 text-indigo-700'
                            )}
                        >
                            {page}
                        </Button>
                    );
                })}
            </div>

            {/* Next Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 hover:bg-indigo-50 border-indigo-200 text-indigo-700"
            >
                Next
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    );
};
