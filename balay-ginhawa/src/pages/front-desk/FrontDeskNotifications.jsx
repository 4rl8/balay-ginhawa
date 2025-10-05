import { useState } from "react";
import { FrontDeskHeader } from "@/components/FrontDeskHeader";
import { FrontDeskSidePanel } from "@/components/FrontDeskSidePanel";

export function FrontDeskNotifications() {
  // Hardcoded sample notifications so this page is semi-functional
  const [notifications, setNotifications] = useState([
    {
      id: "t1",
      room: "Room 062 (Family)",
      message: "Minor Repair completed, waiting for an update",
      status: "pending",
      time: "Today",
    },
    {
      id: "t2",
      room: "Room 101 (Deluxe)",
      message: "Replace light bulb in bathroom",
      status: "pending",
      time: "Yesterday",
    },
    {
      id: "t3",
      room: "Room 015 (Standard)",
      message: "Deep clean requested",
      status: "updated",
      time: "2 days ago",
    },
  ]);

  const handleMarkUpdated = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "updated" } : n))
    );
  };

  return (
    <>
      <title>balay Ginhawa</title>

      {/* Header component para sa Front Desk pages */}
      <FrontDeskHeader />

      <div className="flex">
        {/* Side panel kung saan naka highlight ang Notifications */}
        <FrontDeskSidePanel active="Notifications" />

        <main className="flex-1 p-6 bg-[#FDF4EC] min-h-screen">
          {/* Container para sa notifications table */}
          <div className="shadow-md mt-4 bg-white rounded-xl border border-lime-200">
            <div className="bg-lime-700 rounded-t-xl px-6 py-3">
              <h2 className="text-white text-lg font-semibold">Housekeeping Notifications</h2>
            </div>

            <div className="p-4">
              <ul className="space-y-4">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`flex items-start justify-between gap-4 border-b pb-3 ${
                      n.status === "updated" ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">{n.room}</div>
                      <div
                        className={`text-gray-800 mt-1 ${
                          n.status === "updated" ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {n.message}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xs text-gray-500">{n.time}</div>
                      {n.status === "updated" ? (
                        <button
                          disabled
                          className="px-3 py-1 bg-lime-200 text-lime-700 rounded text-sm"
                        >
                          Updated
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkUpdated(n.id)}
                          className="px-3 py-1 bg-lime-600 text-white rounded text-sm hover:bg-lime-700"
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {/* If no notifications show a friendly empty state */}
              {notifications.length === 0 && (
                <div className="text-center text-gray-500 py-8">No housekeeping notifications</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
