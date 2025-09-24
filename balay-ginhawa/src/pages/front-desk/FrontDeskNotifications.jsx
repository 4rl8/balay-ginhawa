import { FrontDeskHeader } from "@/components/FrontDeskHeader";
import { FrontDeskSidePanel } from "@/components/FrontDeskSidePanel";

export function FrontDeskNotifications() {
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
          <div className="shadow-md mt-4 bg-white rounded-xl">
            <table className="min-w-full text-center border-collapse border-lime-700 border-1">
              <thead className="bg-lime-700">
                <tr>
                  {/* Table header na naka merge ng tatlong columns gamit colSpan */}
                  <th
                    colSpan={3}
                    className="px-4 py-2 font-semibold text-white text-left"
                  >
                    Housekeeping Notifications
                  </th>
                </tr>
              </thead>
              <tbody className="text-left divide-y divide-gray-200">
                {/* Sample row na may 3 equal parts left, center, right */}
                <tr>
                  <td className="w-1/5 px-4 py-2">Left</td>
                  <td className="w-3/5 px-4 py-2">Center (wider)</td>
                  <td className="w-1/5 px-4 py-2">Right</td>
                </tr>

                {/* Example notification row na may icon, message, at date */}
                <tr>
                  <td className="w-1/5 px-4 py-2">🔔</td>
                  <td className="w-3/5 px-4 py-2">New booking added</td>
                  <td className="w-1/5 px-4 py-2">Today</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}
