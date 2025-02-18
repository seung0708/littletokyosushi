import { Tabs, TabsContent } from '@/components/ui/tabs'
import { ItemsListSkeleton } from '@/components/admin/skeletons'

export default function ItemsLoading() {
  return (
    <section className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <div className='ml-auto flex items-center gap-2'>
            {/* Search bar skeleton */}
            <div className="h-10 w-[250px] bg-gray-200 animate-pulse rounded" />
            {/* Add button skeleton */}
            <div className="h-10 w-[120px] bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
        <TabsContent value="all" className="mt-4">
          <ItemsListSkeleton />
        </TabsContent>
      </Tabs>
      {/* Pagination skeleton */}
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 w-10 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
    </section>
  )
}