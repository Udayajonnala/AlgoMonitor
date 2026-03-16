import { useEffect, useState } from "react";
import { ExternalLink, Trash2, Calendar } from "lucide-react";

const platformColors = {
  Codeforces: "bg-blue-500",
  LeetCode: "bg-yellow-500",
  CodeChef: "bg-amber-600",
};


export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
 const user = JSON.parse(localStorage.getItem("user") || "null");

 useEffect(() => {

  if (!user) return;

  fetch(`http://localhost:5000/api/bookmarks/${user._id}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setBookmarks(data.data);
      }
    })
    .catch((err) => console.error(err));

}, [user]);
const removeBookmark = async (contestId) => {
  try {

    await fetch(
      `http://localhost:5000/api/bookmarks/${user._id}/${contestId}`,
      { method: "DELETE" }
    );

    setBookmarks((prev) =>
      prev.filter((contest) => contest.contestId !== contestId)
    );

  } catch (error) {
    console.error("Error removing bookmark:", error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {bookmarks.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <p className="text-gray-500 text-lg">
              You haven't bookmarked any contests yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((contest) => (
              <div
                key={contest.contestId}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  {/* Platform badge */}
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${
                      platformColors[contest.platform]
                    } mb-3`}
                  >
                    {contest.platform}
                  </div>

                  {/* Contest title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[56px]">
                    {contest.name}
                  </h3>

                  {/* Time */}
                 <p className="text-sm text-gray-500 mt-3 flex items-center gap-2 whitespace-nowrap">
  <Calendar className="w-4 h-4 text-gray-500" />
  {contest.startTime &&
    new Date(contest.startTime).toLocaleDateString()}{" "}
  {contest.startTime &&
    new Date(contest.startTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
</p>
</div>

                {/* Buttons */}
                <div className="flex gap-2 mt-6">
                  <a
                    href={contest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Visit Contest</span>
                  </a>

                  <button
                    onClick={() => removeBookmark(contest.contestId)}
                    className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}