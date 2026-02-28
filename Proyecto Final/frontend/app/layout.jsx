import './globals.css';
import NavBar from './components/NavBar';

export const metadata = {
  title: 'Leveling UP - Fitness App',
  description: 'Tu asistente de fitness con IA motivacional',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100 dark">
        <main className="min-h-screen w-full">
          <NavBar />
          {children}
        </main>
      </body>
    </html>
  );
}
