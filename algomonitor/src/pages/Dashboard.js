import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { Award, Zap, Code2, BarChart3, Target ,Info} from "lucide-react";

export default function Dashboard() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/dashboard-stats/${user?._id}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchData();
  }, [user?._id]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
  
        <p className="font-medium text-slate-500 italic text-sm uppercase tracking-widest">
          Gathering achievements...
        </p>
      </div>
    );

  if (!data)
    return (
      <div className="p-20 text-center text-slate-500">
        No data found. Please check your Profile handles.
      </div>
    );

  const lc = data.leetcode || {};
  const cf = data.codeforces || {};
  const cc = data.codechef || {};

  const lcStats = lc.stats || [];
  const lcTotal = lcStats.find(d => d.difficulty === "All")?.count || 0;

  const cfTotal = cf.totalSolved || 0;
  const ccTotal = cc.solved || 0;

 const grandTotal = lcTotal + cfTotal;

  const cfTopicData =
    (cf.topics || []).length
      ? cf.topics.sort((a, b) => b.count - a.count).slice(0, 8)
      : [];

  const isLcLinked = lcStats.length > 0;
  const isCfLinked = cfTotal > 0 || cf.rating > 0;
const isCcLinked = cc.rating > 0 || cc.globalRank > 0;

  const noPlatformLinked = !isLcLinked && !isCfLinked && !isCcLinked;
  const statsCount =
  (isLcLinked ? 1 : 0) +
  (isCfLinked ? 1 : 0) +
  (isCcLinked ? 1 : 0);

const statsGridCols =
  statsCount === 1
    ? "grid-cols-1"
    : statsCount === 2
    ? "grid-cols-1 md:grid-cols-2"
    : "grid-cols-1 md:grid-cols-3";

  return (
    <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen text-slate-900 font-sans">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
          <p className="text-slate-500 font-medium tracking-tight">
            Track your competitive programming progress here
          </p>

<div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm text-center relative">

  <div className="absolute top-2 right-2 group cursor-pointer">
    <Info size={14} className="text-slate-400" />
    
   <div className="absolute right-0 mt-2 w-40 text-xs bg-white text-slate-700 border border-slate-200 p-2 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition">
  Total from LeetCode + Codeforces
</div>
  </div>

  <p className="text-[10px] text-slate-400 font-semibold mt-1">
    Problems Solved
  </p>

  <p className="text-2xl font-black text-indigo-600">
    {grandTotal}
  </p>

</div>
        </header>

        {/* Empty State */}

        {noPlatformLinked && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm mb-10">
            <Code2 size={40} className="mx-auto text-slate-300 mb-4" />

            <h2 className="text-lg font-black text-slate-700 uppercase tracking-wide">
              No Platforms Linked
            </h2>

            <p className="text-sm text-slate-400 mt-2 mb-6">
              Connect your LeetCode, Codeforces or CodeChef handles to
              start tracking your progress.
            </p>

            <button
              onClick={() => window.location.href = "/profile"}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-indigo-700 transition"
            >
              Go to Profile
            </button>
          </div>
        )}

        {/* Stats Cards */}

        {!noPlatformLinked && (
         <div className={`grid ${statsGridCols} gap-6 mb-10`}>

            {isLcLinked && (
              <StatCard
                title="LeetCode Rank"
                value={lc.ranking || "N/A"}
                label="Global Rank"
                icon={<Zap className="text-orange-500" />}
              />
            )}

            {isCfLinked && (
              <StatCard
                title="CF Rating"
                value={cf.rating || 0}
                label="Current Rating"
                icon={<BarChart3 className="text-blue-500" />}
              />
            )}

            {isCcLinked && (
              <StatCard
                title="CC Rating"
                value={cc.rating || 0}
                label="Current Rating"
                icon={<Award className="text-purple-500" />}
              />
            )}

          </div>
        )}

        {/* Main Grid */}

        {!noPlatformLinked && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Topic Chart */}

            {isCfLinked && (
              <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

                <div className="mb-10">
                  <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-tight">
                    <Target size={20} className="text-indigo-600" />
                    Topic Proficiency
                  </h3>

                  <p className="text-sm text-slate-400 font-medium italic">
                    Category breakdown from Codeforces
                  </p>
                </div>

                {cfTopicData.length > 0 ? (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={cfTopicData} margin={{ left: 30 }}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={true}
                          vertical={false}
                          stroke="#f1f5f9"
                        />

                        <XAxis type="number" hide />

                        <YAxis
                          dataKey="topic"
                          type="category"
                          tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                          width={110}
                        />

                        <Tooltip
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        />

                        <Bar
                          dataKey="count"
                          fill="#4f46e5"
                          radius={[0, 6, 6, 0]}
                          barSize={24}
                          activeBar={{ fill: '#3730a3' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl">
                    <p className="text-slate-400 font-medium">
                      No topic data available
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Platform Cards */}

            <div className="lg:col-span-4 space-y-6">

              {isLcLinked && (
                <PlatformDetailCard
                  name="LeetCode"
                  solved={lcTotal}
                  color="text-orange-500"
                  bgColor="bg-orange-50"
                  stats={[
                    { label: 'Easy', value: lcStats.find(d => d.difficulty === "Easy")?.count || 0 },
                    { label: 'Medium', value: lcStats.find(d => d.difficulty === "Medium")?.count || 0 },
                    { label: 'Hard', value: lcStats.find(d => d.difficulty === "Hard")?.count || 0 }
                  ]}
                />
              )}

              {isCfLinked && (
                <PlatformDetailCard
                  name="Codeforces"
                  solved={cfTotal}
                  color="text-blue-600"
                  bgColor="bg-blue-50"
                  stats={[
                    { label: 'Max Rating', value: cf.maxRating || 0 },
                    { label: 'Rank', value: cf.rank || "N/A" }
                  ]}
                />
              )}

              {isCcLinked && (
                <PlatformDetailCard
                  name="CodeChef"
                  solved={null}
                  color="text-purple-600"
                  bgColor="bg-purple-50"
                  stats={[
                    { label: 'Global Rank', value: cc.globalRank || "N/A" },
                    { label: 'Stars', value: cc.stars || "N/A" }
                  ]}
                />
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}


function StatCard({ title, value, label, icon }) {

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          {icon}
        </div>

        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
          {title}
        </p>
      </div>

      <p className="text-3xl font-black text-slate-900 tracking-tight">
        {value.toLocaleString()}
      </p>

      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic">
        {label}
      </p>

    </div>
  );
}


function PlatformDetailCard({ name, solved, stats, color, bgColor }) {

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h3 className={`font-black text-sm uppercase tracking-wider ${color}`}>
            {name}
          </h3>

         {solved !== null && (
  <>
    <p className="text-2xl font-black text-slate-800">
      {solved}
    </p>

    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
      Solved Problems
    </p>
  </>
)}
        </div>

        <div className={`h-10 w-10 ${bgColor} rounded-full flex items-center justify-center font-black ${color}`}>
          {name.charAt(0)}
        </div>

      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100">

        {stats.map((stat, i) => (
          <div key={i} className="flex justify-between items-center">

            <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">
              {stat.label}
            </span>

            <span className="text-sm font-black text-slate-800">
              {stat.value}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}