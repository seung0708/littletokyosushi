'use client';

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    params.set('page', '1'); // Reset to first page on search
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Input
      type="text"
      placeholder="Search items..."
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get('query')?.toString()}
      className="h-8 w-[150px] lg:w-[250px]"
    />
  );
}