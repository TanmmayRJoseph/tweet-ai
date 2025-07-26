import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface TweetCardProps {
  tweet: {
    id: number;
    text: string;
    mood: string;
  };
  onDelete: (id: number) => void;
}

export default function TweetCard({ tweet, onDelete }: TweetCardProps) {
  const openInXUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet.text)}`;

  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground mb-1 capitalize">
            Mood: {tweet.mood}
          </p>
          <p className="text-lg font-medium">{tweet.text}</p>
        </div>

        <div className="flex flex-col gap-2 items-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(tweet.id)}
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open(openInXUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Open in X
          </Button>
        </div>
      </div>
    </div>
  );
}
