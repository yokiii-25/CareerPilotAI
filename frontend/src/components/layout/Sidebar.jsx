import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl p-6">
      <h1 className="text-3xl font-bold text-blue-400 mb-10">
  CareerPilot AI
</h1>

      <nav className="space-y-4">
        <Link to="/dashboard" className="block px-4 py-3 rounded-lg hover:bg-blue-600 transition">
          📊 Dashboard
        </Link>

        <Link to="/" className="block px-4 py-3 rounded-lg hover:bg-blue-600 transition">
          📄 Resume Upload
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;