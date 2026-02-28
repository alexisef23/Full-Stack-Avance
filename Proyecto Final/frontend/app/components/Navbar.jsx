'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

function NavLink({ href, children }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded border transition ${
        active
          ? 'border-neon-purple text-neon-purple glow-purple'
          : 'border-slate-700 text-slate-300 hover:border-neon-blue hover:text-neon-blue'
      }`}
    >
      {children}
    </Link>
  );
}

export default function NavBar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/dashboard" className="font-bold text-neon-blue text-xl">
          Leveling UP
        </Link>

        {isAuthenticated && (
          <nav className="flex items-center gap-2 flex-wrap justify-end">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/dashboard/history">Historial</NavLink>
            <NavLink href="/dashboard/chat">Chat IA</NavLink>
            {user?.role === 'admin' && <NavLink href="/dashboard/admin/ejercicios">Admin</NavLink>}

            <button
              onClick={logout}
              className="px-3 py-2 rounded border border-red-500 text-red-300 hover:bg-red-900/30 transition"
            >
              Cerrar sesión
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-900 border-b-2 border-neon-blue/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold text-neon-blue">
          Leveling UP
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-slate-300 hover:text-neon-blue transition">
            Dashboard
          </Link>
          <Link href="/dashboard/history" className="text-slate-300 hover:text-neon-blue transition">
            Historial
          </Link>
          <Link href="/dashboard/chat" className="text-slate-300 hover:text-neon-purple transition">
            Chat IA
          </Link>

          <div className="border-l border-slate-700 pl-6">
            <span className="text-slate-400 text-sm mr-4">{user?.email}</span>
            <button
              onClick={logout}
              className="btn-outline text-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
