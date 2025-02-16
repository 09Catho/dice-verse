import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TutorialProps {
  onClose: () => void;
}

export function Tutorial({ onClose }: TutorialProps) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Welcome to DiceVerse!
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Let's get you started with our advanced dice simulation platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-gray-300">
          <div>
            <h3 className="font-semibold mb-2">🎲 Rolling the Dice</h3>
            <p className="text-sm">Click the "Roll Dice" button or enable auto-roll for continuous simulation.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">📊 Real-time Statistics</h3>
            <p className="text-sm">Watch as the statistics update instantly with each roll, showing distribution and averages.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">⚙️ Customization</h3>
            <p className="text-sm">Adjust roll speed, toggle sound effects, and export your data for analysis.</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} className="bg-purple-600 hover:bg-purple-700">
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}