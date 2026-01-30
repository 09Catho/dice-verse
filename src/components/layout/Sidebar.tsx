import { useDice } from '@/context/DiceContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { DieType } from '@/types';
import { Dice5, Trash2, Download, Dices } from 'lucide-react';

export function Sidebar() {
  const { config, setConfig, autoRoll, setAutoRoll, clearHistory, history, roll, isRolling } = useDice();

  const handleTypeChange = (value: string) => {
    setConfig({ ...config, type: value as DieType });
  };

  const handleCountChange = (value: number[]) => {
    setConfig({ ...config, count: value[0] });
  };

  const handleExport = () => {
    if (history.length === 0) return;

    // Simple CSV export
    const headers = 'Roll ID,Timestamp,Total,Dice Type,Individual Values\n';
    const rows = history.map(h =>
      `${h.id},${new Date(h.timestamp).toISOString()},${h.total},${h.results[0].type},"${h.results.map(r => r.value).join(';')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dice_rolls_${new Date().toISOString()}.csv`;
    link.click();
  };

  return (
    <div className="w-full md:w-80 p-4 space-y-6 bg-gray-900 border-r border-gray-800 h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-8">
        <Dices className="w-8 h-8 text-purple-500" />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          DiceVerse
        </h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Dice Type</Label>
          <Select value={config.type} onValueChange={handleTypeChange} disabled={isRolling}>
            <SelectTrigger>
              <SelectValue placeholder="Select dice type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="d4">d4 (Tetrahedron)</SelectItem>
              <SelectItem value="d6">d6 (Cube)</SelectItem>
              <SelectItem value="d8">d8 (Octahedron)</SelectItem>
              <SelectItem value="d10">d10 (Pentagonal Trapezohedron)</SelectItem>
              <SelectItem value="d12">d12 (Dodecahedron)</SelectItem>
              <SelectItem value="d20">d20 (Icosahedron)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Number of Dice</Label>
            <span className="text-sm text-gray-400">{config.count}</span>
          </div>
          <Slider
            value={[config.count]}
            onValueChange={handleCountChange}
            min={1}
            max={10}
            step={1}
            disabled={isRolling}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <Label htmlFor="autoroll">Auto Roll</Label>
          <Switch
            id="autoroll"
            checked={autoRoll}
            onCheckedChange={setAutoRoll}
          />
        </div>

        <Button
          className="w-full h-12 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all"
          onClick={roll}
          disabled={isRolling || autoRoll}
        >
          <Dice5 className="mr-2 h-6 w-6" />
          ROLL
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={clearHistory} disabled={history.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={history.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-800">
        <div className="text-sm text-gray-500 text-center">
          <p>Total Rolls: {history.length}</p>
        </div>
      </div>
    </div>
  );
}
