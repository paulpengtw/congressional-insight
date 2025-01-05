import { ChevronDown } from 'lucide-react';
import { Session } from '../types';

interface SessionSelectorProps {
  selectedSession: Session;
  availableSessions: Session[];
  onSessionChange: (term: number, session: number) => void;
}

export function SessionSelector({ 
  selectedSession, 
  availableSessions,
  onSessionChange 
}: SessionSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Select Session</label>
      <div className="relative">
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background appearance-none cursor-pointer pr-8"
          value={`${selectedSession.term}-${selectedSession.session}`}
          onChange={(e) => {
            const [term, session] = e.target.value.split('-').map(Number);
            onSessionChange(term, session);
          }}
        >
          {availableSessions.map((session) => (
            <option 
              key={`${session.term}-${session.session}`} 
              value={`${session.term}-${session.session}`}
            >
              第{session.term}屆第{session.session}會期
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
} 