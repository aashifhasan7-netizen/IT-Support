import { Sidebar, useSidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumb?: string;
}

export function AppLayout({ children, title, breadcrumb }: AppLayoutProps) {
  const sidebar = useSidebar();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isOpen={sidebar.isOpen} onClose={sidebar.close} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={sidebar.toggle} title={title} breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
