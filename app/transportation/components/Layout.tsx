import { Building2 } from 'lucide-react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                <h1 className="text-xl font-bold">Congressional Insights</h1>
              </Link>
            </div>
            <h2 className="text-lg font-semibold">Transportation Committee Meetings</h2>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 