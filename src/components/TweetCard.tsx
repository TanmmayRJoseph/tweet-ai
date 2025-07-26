// components/TweetCard.tsx
import { Button } from "@/components/ui/button";

interface TweetCardProps {
  tweet: {
    id: number;
    text: string;
    mood: string;
  };
  onDelete: (id: number) => void;
}

export default function TweetCard({ tweet, onDelete }: TweetCardProps) {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground mb-1 capitalize">
            Mood: {tweet.mood}
          </p>
          <p className="text-lg font-medium">{tweet.text}</p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(tweet.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
