
import { RoomCard } from "./RoomCard";

export function RoomList({ roomTypes, activeTypes, findClicked, onBook }) {
  return (
    <div className="w-full md:w-[70%]">
      {roomTypes
        .filter(rt => activeTypes.includes(rt.id))
        .map(rt => (
          <RoomCard
            key={rt.id}
            roomType={rt}
            findClicked={findClicked}
            onBook={onBook}
          />
        ))}
    </div>
  );
}
