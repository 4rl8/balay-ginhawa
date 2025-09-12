
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
                    <h1 className="text-2xl font-bold mb-4">Rooms</h1>
                    <p>Manage your Rooms here.</p>
                </main>

            </div>
    </>
    );
}