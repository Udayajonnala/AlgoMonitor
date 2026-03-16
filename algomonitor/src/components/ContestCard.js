import { useState, useEffect } from "react";
import { ExternalLink, Bookmark, BookmarkCheck, Calendar } from "lucide-react";


function getTimeRemaining(startTime) {
  const now = new Date();
  const diff = startTime.getTime() - now.getTime();

  if (diff < 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

const platformColors = {
  Codeforces: "bg-blue-500",
  LeetCode: "bg-yellow-500",
  CodeChef: "bg-amber-600",
};

export function ContestCard({
  platform,
  title,
  startTime,
  contestUrl,
  isBookmarked = false,
  onBookmark,
}) {
  const [countdown, setCountdown] = useState(() =>
    getTimeRemaining(startTime)
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getTimeRemaining(startTime));
    }, 60000);

    return () => clearInterval(interval);
  }, [startTime]);

  const handleBookmarkClick = async () => {
    if (loading) return;

    setLoading(true);

    if (onBookmark) {
      await onBookmark();
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100">
      <div
        className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${platformColors[platform]} mb-3`}
      >
        {platform}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
        {title}
      </h3>

    <div className="space-y-2 mb-4">
  <p className="text-sm text-gray-600 flex items-center gap-2 whitespace-nowrap">
    <Calendar className="w-4 h-4 text-gray-500" />
    {startTime.toLocaleDateString()}{","}
    {startTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </p>


        {countdown && (
          <p className="text-sm font-semibold text-indigo-600">
            Starts in: {countdown}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <a
          href={contestUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Visit Contest</span>
        </a>

        {onBookmark && (
          <button
            onClick={handleBookmarkClick}
            disabled={loading}
            className={`p-2 rounded-md transition-colors ${
              isBookmarked
                ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } disabled:opacity-50`}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}