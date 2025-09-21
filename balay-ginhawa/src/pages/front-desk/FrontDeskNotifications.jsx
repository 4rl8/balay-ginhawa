
import { FrontDeskHeader } from "@/components/FrontDeskHeader";
import { FrontDeskSidePanel } from "@/components/FrontDeskSidePanel";

export function FrontDeskNotifications() {
  return (
    <>
        <title>balay Ginhawa</title>


            <FrontDeskHeader />


            <div className="flex">
                <FrontDeskSidePanel active="Notifications" />
                <main className="flex-1 p-6 bg-[#FDF4EC] min-h-screen">
                    <div className="shadow-md mt-4 bg-white rounded-xl">
            <table className="min-w-full text-center border-collapse border-lime-700 border-1">
              <thead className="bg-lime-700">
                <tr>
                  <th
                    colSpan={3}
                    className="px-4 py-2 font-semibold text-white text-left">Housekeeping Notifications
                  </th>
                </tr>
              </thead>
              <tbody className="text-left divide-y divide-gray-200">
                <tr>
                  <td className="w-1/5 px-4 py-2">Left</td>
                  <td className="w-3/5 px-4 py-2">Center (wider)</td>
                  <td className="w-1/5 px-4 py-2">Right</td>
                </tr>
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