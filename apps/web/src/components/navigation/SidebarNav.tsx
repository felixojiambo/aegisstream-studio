import { Link } from "react-router-dom";

export function SidebarNav() {
  return (
    <aside className="w-64 border-r min-h-screen p-4">
      <nav className="flex flex-col gap-3">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/cases">Cases</Link>
        <Link to="/reviews">Reviews</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </aside>
  );
}
