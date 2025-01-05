'use client';

import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { FilterSidebar } from './components/FilterSidebar';
import { TranscriptCard } from './components/TranscriptCard';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with actual API calls
const MOCK_DATA = {
  transcripts: [
    {
      id: '1',
      congressmanId: '1',
      date: '2024-03-20',
      topic: 'Climate Change Policy Discussion',
      content: 'We must take immediate action to address the growing climate crisis...',
      tags: ['Climate', 'Environment', 'Policy'],
      meetingId: '1',
    },
    {
      id: '2',
      congressmanId: '2',
      date: '2024-03-20',
      topic: 'Healthcare Reform Debate',
      content: 'The current healthcare system needs significant improvements...',
      tags: ['Healthcare', 'Reform', 'Policy'],
      meetingId: '1',
    },
  ],
  congressmen: [
    {
      id: '1',
      name: 'Jane Smith',
      party: 'Democrat',
      state: 'California',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop&crop=faces',
    },
    {
      id: '2',
      name: 'John Doe',
      party: 'Republican',
      state: 'Texas',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces',
    },
  ],
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              <h1 className="text-xl font-bold">Congressional Insights</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/transportation" 
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Transportation Committee
              </Link>
              <div className="w-96">
                <SearchBar onSearch={setSearchQuery} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <FilterSidebar onFilterChange={setFilters} />
          
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-6">
              {MOCK_DATA.transcripts.map((transcript) => (
                <TranscriptCard
                  key={transcript.id}
                  transcript={transcript}
                  congressman={MOCK_DATA.congressmen.find((c) => c.id === transcript.congressmanId)!}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}