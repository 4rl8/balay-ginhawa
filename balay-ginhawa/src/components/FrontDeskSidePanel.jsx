import { BookOpenIcon, BuildingOffice2Icon, CurrencyDollarIcon, BellIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Bookings', icon: BookOpenIcon, path: '/frontdesk' },
  { label: 'Rooms', icon: BuildingOffice2Icon, path: '/frontdesk/rooms' },
  { label: 'Payments', icon: CurrencyDollarIcon, path: '/frontdesk/payments' },
  { label: 'Notifications', icon: BellIcon, path: '/frontdesk/notifications' },
];


export function FrontDeskSidePanel({ active = 'Bookings' }) {
  return (
    <aside className="w-60 h-screen border-r border-gray-200 bg-white">
      <ul className="space-y-2">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = label === active;
          return (
            <li key={label}>
              <Link
                to={path}
                className={`flex items-center px-4 py-2 ${isActive
                    ? 'bg-green-600 text-white'
                    : 'text-black hover:bg-gray-100'
                  }`}
              >
                {Icon && <Icon className="h-6 w-6 mr-3" />}
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}