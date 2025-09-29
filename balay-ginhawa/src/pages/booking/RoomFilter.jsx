export function RoomFilter({
  onClear,
  priceSort,
  onSortChange,
  occupancyFilter,
  onOccupancyChange
}) {
  return (
    <div className="w-full md:w-[30%]">
      <div className="bg-white border border-gray-300 rounded-md p-8 mb-8 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">FILTERS</h2>
          <button
            className="text-blue-500 text-sm hover:underline"
            onClick={onClear}
            type="button"
          >
            Clear
          </button>
        </div>
        <hr className="my-4 border-gray-300" />
        {/* Price Sort */}
        <div className="mb-6">
          <label className="font-semibold mb-2 block">Price Sort</label>
          <div className="flex gap-2 flex-col">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="priceSort"
                value="low"
                checked={priceSort === "low"}
                onChange={() => onSortChange("low")}
              />
              Low to High
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="priceSort"
                value="high"
                checked={priceSort === "high"}
                onChange={() => onSortChange("high")}
              />
              High to Low
            </label>
          </div>
        </div>
        {/* Occupancy Filter */}
        <div>
          <label className="font-semibold mb-2 block ">Occupancy</label>
          <div className="flex gap-1 flex-col">
            {["Solo", "Couple", "Family", "Group"].map(option => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="occupancy"
                  value={option.toLowerCase()}
                  checked={occupancyFilter === option.toLowerCase()}
                  onChange={() => onOccupancyChange(option.toLowerCase())}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
