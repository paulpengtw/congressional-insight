import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Transcript, Congressman } from '@/app/types/index';

interface TranscriptCardProps {
  transcript: Transcript;
  congressman: Congressman;
}

export function TranscriptCard({ transcript, congressman }: TranscriptCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Image
            src={congressman.imageUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=64&h=64&fit=crop&crop=faces'}
            alt={congressman.name}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
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
          <h3 className="font-semibold mb-2">{transcript.topic}</h3>
          <p className="text-muted-foreground line-clamp-3">{transcript.content}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {transcript.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
