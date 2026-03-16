import { useEffect, useState } from "react";
import {ContestCard} from "../components/ContestCard";
import { PlatformFilter } from "../components/PlatformFilter";

function Contests() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContests = async () => {
      try {
        // Upcoming contests
        const upcomingRes = await fetch("http://localhost:5000/api/contests/upcoming");
        const upcomingData = await upcomingRes.json();

        if (upcomingData.success) {
          const upcomingParsed = upcomingData.data.map((c, index) => ({
  ...c,
 contestId: `${c.platform}-${index}`,
  contestUrl: c.url,
  startTime: new Date(c.startTime),
}));
          setUpcoming(upcomingParsed);
        }

        // Past contests
        const pastRes = await fetch("http://localhost:5000/api/contests/past");
        const pastData = await pastRes.json();

        if (pastData.success) {
         const pastParsed = pastData.data.map((c, index) => ({
  ...c,
contestId: `${c.platform}-${index}`,
  contestUrl: c.url,
  startTime: new Date(c.startTime),
}));

          setPast(pastParsed);
        }
      } catch (error) {
        console.error("Contest fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContests();
  }, []);

  /* ---------- FILTER FUNCTION ---------- */
  const filterContests = (contests) => {
    if (filter === "All") return contests;

    return contests.filter((contest) =>
      contest.platform.toLowerCase().includes(filter.toLowerCase())
    );
  };

  const filteredUpcoming = filterContests(upcoming);
  const filteredPast = filterContests(past);


const [saving, setSaving] = useState(false);

const handleBookmark = async (contest) => {
  if (saving) return; 

  setSaving(true);

  try {
    const response = await fetch("http://localhost:5000/api/bookmarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
         userId: user._id,
        contestId: contest.contestId,
        name: contest.title,
        platform: contest.platform,
        startTime: contest.startTime,
        url: contest.contestUrl,
      }),
    });

    const data = await response.json();

   if (data.message === "Already bookmarked") {
      alert("Already bookmarked");
    } else {
      alert("Bookmark saved");
    }

  } catch (error) {
    console.error("Bookmark error:", error);
  }

  setSaving(false);
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <h2 className="text-xl font-semibold text-gray-600">
          Loading contests...
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Coding Contests
        </h1>
        <p className="text-gray-600 mt-2">
          Track and participate in upcoming coding competitions.
        </p>
      </div>

      {/* FILTER */}
      <div className="mb-8  flex justify-start">
        <PlatformFilter
          selectedPlatform={filter}
          onSelectPlatform={setFilter}
        />
      </div>

      {/* UPCOMING */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          Upcoming Contests
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUpcoming.length === 0 ? (
            <p className="text-gray-500">
              No upcoming contests for {filter}
            </p>
          ) : (
            filteredUpcoming.map((contest, index) => (
              <ContestCard
                key={contest.contestId || index}
                platform={contest.platform}
                title={contest.title}
                startTime={contest.startTime}
                contestUrl={contest.contestUrl}
                onBookmark={() => handleBookmark(contest)}
                isBookmarked={false}
              />
            ))
          )}
        </div>
      </div>

      {/* PAST */}
      <div>
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Past Contests
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPast.length === 0 ? (
            <p className="text-gray-500">
              No past contests for {filter}
            </p>
          ) : (
            filteredPast.map((contest, index) => (
              <ContestCard
                key={contest.contestId || index}
                platform={contest.platform}
                title={contest.title}
                startTime={contest.startTime}
                contestUrl={contest.contestUrl}
                onBookmark={() => handleBookmark(contest)}
                isBookmarked={false}
              />
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default Contests;