import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loading } from '@/components/ui/loading';

function ModifiersContent() {
  const searchParams = useSearchParams();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Modifiers</h1>
      <p>Manage your menu modifiers here.</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <Loading variant="admin" size="lg" />
        </div>
      }
    >
      <ModifiersContent />
    </Suspense>
  )
}