import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Settings({ open, onOpenChange }: SettingsProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  // We'll store sound preference in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('dice-sound-enabled');
    if (stored !== null) {
      setSoundEnabled(JSON.parse(stored));
    }
  }, []);

  const handleSoundChange = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('dice-sound-enabled', JSON.stringify(enabled));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription className="text-gray-400">
            Customize your dice rolling experience.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Sound Effects</Label>
              <div className="text-sm text-gray-400">
                Play sound when rolling dice
              </div>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={handleSoundChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
