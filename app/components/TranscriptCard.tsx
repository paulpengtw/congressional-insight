import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transcript, Congressman } from '../types';
import Image from 'next/image';

interface TranscriptCardProps {
  transcript: Transcript;
  congressman: Congressman;
}

export function TranscriptCard({ transcript, congressman }: TranscriptCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12">
            <Image
              src={congressman.imageUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=64&h=64&fit=crop&crop=faces'}
              alt={congressman.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <CardTitle className="text-lg">{congressman.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{congressman.party}</span>
              <span>•</span>
              <span>{congressman.state}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          {transcript.topic && (
            <Badge variant="secondary" className="mb-2">
              {transcript.topic}
            </Badge>
          )}
          <p className="text-sm text-muted-foreground">{transcript.content}</p>
        </div>
        {transcript.summary && (
          <div className="text-sm border-t pt-4">
            <strong>Summary:</strong> {transcript.summary}
          </div>
        )}
      </CardContent>
    </Card>
  );
}