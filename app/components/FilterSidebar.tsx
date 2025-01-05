'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className="w-64 p-4 border-r">
      <h2 className="font-semibold mb-4">Filters</h2>
      
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Party</label>
          <Select onValueChange={(value) => onFilterChange({ party: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select party" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Parties</SelectItem>
              <SelectItem value="democrat">Democrat</SelectItem>
              <SelectItem value="republican">Republican</SelectItem>
              <SelectItem value="independent">Independent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Committee</label>
          <Select onValueChange={(value) => onFilterChange({ committee: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select committee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Committees</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="foreign-relations">Foreign Relations</SelectItem>
              <SelectItem value="judiciary">Judiciary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Date</label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
      </div>
    </div>
  );
}