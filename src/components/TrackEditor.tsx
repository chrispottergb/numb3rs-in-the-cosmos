import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TrackEditorProps {
  track: {
    id: string;
    title: string;
    frequency: string;
  };
  onSave: () => void;
  onClose: () => void;
}

const TrackEditor = ({ track, onSave, onClose }: TrackEditorProps) => {
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(track.title);
  const [frequency, setFrequency] = useState(track.frequency || '');

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please provide a title');
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('audio_tracks')
        .update({
          title: title.trim(),
          frequency: frequency.trim() || null,
        })
        .eq('id', track.id);

      if (error) throw error;

      toast.success('Track updated successfully!');
      onSave();
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update track');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 p-6 bg-card border-hermetic rounded-xl shadow-sacred">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <h3 className="text-xl font-display text-gradient-sacred mb-6">
          Edit Track
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Track Title *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter track title"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="edit-frequency">Frequency (optional)</Label>
            <Input
              id="edit-frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="e.g., 528Hz"
              className="mt-1"
            />
          </div>

          <Button
            variant="sacred"
            className="w-full"
            onClick={handleSave}
            disabled={saving || !title.trim()}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrackEditor;
