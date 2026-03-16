const platforms = ["All", "Codeforces", "LeetCode", "CodeChef"];

export function PlatformFilter({ selectedPlatform, onSelectPlatform }) {
  return (
    <div className="flex gap-4">
      {platforms.map((platform) => {
        const isSelected = selectedPlatform === platform;

        return (
          <button
            key={platform}
            onClick={() => onSelectPlatform(platform)}
            className={`px-6 py-2 rounded-full border font-medium transition
              ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {platform}
          </button>
        );
      })}
    </div>
  );
}