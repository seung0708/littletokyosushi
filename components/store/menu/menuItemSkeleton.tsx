export const MenuItemSkeleton = () => (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-gradient-to-b from-black/30 to-black/40 backdrop-blur-sm border border-white/10 animate-pulse">
        <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gray-800/50" />
        <div className="p-4 sm:p-6">
            <div className="h-6 w-3/4 bg-gray-800/50 rounded-md mb-2" />
            <div className="h-5 w-1/4 bg-gray-800/50 rounded-md mb-4" />
            <div className="space-y-2">
                <div className="h-4 w-full bg-gray-800/50 rounded-md" />
                <div className="h-4 w-5/6 bg-gray-800/50 rounded-md" />
            </div>
        </div>
    </div>
);

export const MenuCategorySkeleton = () => (
    <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center space-x-4">
            <div className="h-8 w-48 bg-gray-800/50 rounded-md" />
            <div className="flex-grow h-[1px] bg-gradient-to-r from-gray-800/50 to-transparent" />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <MenuItemSkeleton key={i} />
            ))}
        </div>
    </div>
);

