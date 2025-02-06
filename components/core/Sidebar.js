import { useState } from "react";

import {
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
  Calendar,
  CheckCircle,
  List,
  Bell,
  Clipboard,
} from "lucide-react";
import Link from "next/link";

const handleLogout = () => {
  // Remove token from client storage
  localStorage.removeItem("token"); // or sessionStorage
  // Redirect to login page
  window.location.href = "/";
};

const menuItems = [
  {
    title: "Documents",
    icon: FileText,
    subItems: [
      { name: "Surveys", href: "/surveys", icon: Clipboard },
      { name: "News", href: "/news", icon: Bell },
      { name: "Checklists", href: "/checklists", icon: List },
      { name: "Requests", href: "/requests", icon: CheckCircle },
      { name: "Calendars", href: "/calendars", icon: Calendar },
    ],
  },
  {
    title: "Profiles",
    icon: Users,
    subItems: [
      { name: "Locations", href: "/profiles/locations", icon: Home },
      { name: "Users", href: "/profiles/users", icon: Users },
      { name: "Products", href: "/profiles/products", icon: FileText },
    ],
  },
];

export default function Sidebar() {
  const [openGroup, setOpenGroup] = useState(null);

  return (
    <div className="w-64 font-sans bg-indigo-600 text-gray-200 text-sm p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold font-sans mb-6">
          <Link
            href="/home"
            className="block px-4 py-2 text-gray-300 hover:bg-gray-800"
          >
            Company Name
          </Link>
        </h1>
        <nav>
          {menuItems.map((group, index) => (
            <div key={index}>
              <button
                className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-700"
                onClick={() => setOpenGroup(openGroup === index ? null : index)}
              >
                <group.icon className="mr-2" size={20} />
                {group.title}
              </button>
              {openGroup === index && (
                <div className="ml-6">
                  {group.subItems.map((item, subIndex) => (
                    <Link
                      key={subIndex}
                      href={item.href}
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
                    >
                      <item.icon className="inline-block mr-2" size={16} />
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div>
        <button className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-700">
          <Settings className="mr-2" size={20} /> Settings
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-700"
        >
          <LogOut className="mr-2" size={20} /> Logout
        </button>
      </div>
    </div>
  );
}
