'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search transcripts, topics, or congresspeople..."
        className="pl-10"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}