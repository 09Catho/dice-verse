import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/button';
import { Menu, Settings as SettingsIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Settings } from '../Settings';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="flex md:hidden items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-gray-900 border-r-gray-800 w-80">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <span className="font-bold text-lg">DiceVerse</span>
          <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
             <SettingsIcon className="h-5 w-5" />
          </Button>
        </header>

        {/* Desktop Settings Trigger (Absolute) */}
        <div className="hidden md:block absolute top-4 right-4 z-50">
             <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
                 <SettingsIcon className="h-5 w-5 text-gray-400 hover:text-white" />
             </Button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>

      <Settings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
}
