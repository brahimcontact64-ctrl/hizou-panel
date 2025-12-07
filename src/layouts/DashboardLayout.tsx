import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Camera,
  Palette,
  Globe2,
  DollarSign,
  Share2,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/creatives", icon: Camera, label: "Creatives" },
  { path: "/design", icon: Palette, label: "Design" },
  { path: "/dev-themes", icon: Globe2, label: "Dev Themes" },
  { path: "/sponsoring", icon: DollarSign, label: "Sponsoring" },
  { path: "/social", icon: Share2, label: "Social" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();

  const [open, setOpen] = useState(false); // Mobile drawer

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const SidebarContent = (
    <nav className="p-4 space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setOpen(false)} // close drawer on mobile
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
              isActive
                ? "bg-gradient-to-r from-primary to-primary-light text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}

      <button
        onClick={() => {
          handleSignOut();
          setOpen(false);
        }}
        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Hizou Panel
          </h1>
        </div>

        {SidebarContent}
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Hizou Panel</h1>

          <button onClick={() => setOpen(true)}>
            <Menu size={30} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50 md:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>

              <button onClick={() => setOpen(false)}>
                <X size={26} />
              </button>
            </div>

            {SidebarContent}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Desktop Header */}
        <header className="hidden md:block bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {navItems.find((item) => item.path === location.pathname)?.label ||
                "Dashboard"}
            </h2>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.email}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 pt-20 md:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}