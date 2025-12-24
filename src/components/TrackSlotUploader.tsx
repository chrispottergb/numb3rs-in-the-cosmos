import { useState, useRef } from 'react';
import { Upload, Music, X, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TrackSlotUploaderProps {
  slotIndex: number;
  defaultTitle: string;
  defaultFrequency: string;
  existingTrack?: {
    id: string;
    title: string;
    frequency: string;
    file_url: string;
  } | null;
  onUploadComplete: () => void;
  onClose: () => void;
}

const TrackSlotUploader = ({ 
  slotIndex, 
  defaultTitle, 
  defaultFrequency,
  existingTrack,
  onUploadComplete, 
  onClose 
}: TrackSlotUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState(existingTrack?.title || defaultTitle);
  const [frequency, setFrequency] = useState(existingTrack?.frequency || defaultFrequency);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/wave',
        'audio/x-wav',
        'audio/ogg',
        'audio/flac',
        'audio/aac',
        'audio/m4a',
        'audio/x-m4a'
      ];
      
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      const isValidType = validTypes.includes(selectedFile.type) || 
        ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(fileExt || '');
      
      if (!isValidType) {
        toast.error('Please select a valid audio file (MP3, WAV, OGG, FLAC, AAC, M4A)');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !title) {
      toast.error('Please provide a title and select a file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `slot-${slotIndex}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('audio-tracks')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setUploadProgress(95);

      const { data: { publicUrl } } = supabase.storage
        .from('audio-tracks')
        .getPublicUrl(fileName);

      // If there's an existing track for this slot, update it; otherwise insert
      if (existingTrack) {
        const { error: updateError } = await supabase
          .from('audio_tracks')
          .update({
            title,
            frequency: frequency || null,
            file_url: publicUrl,
            description: `Track slot ${slotIndex + 1}`,
          })
          .eq('id', existingTrack.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('audio_tracks')
          .insert({
            title,
            frequency: frequency || null,
            file_url: publicUrl,
            description: `Track slot ${slotIndex + 1}`,
          });

        if (insertError) throw insertError;
      }

      setUploadProgress(100);
      toast.success(`Track ${slotIndex + 1} uploaded successfully!`);
      onUploadComplete();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload track');
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 p-6 bg-card border-hermetic rounded-xl shadow-sacred">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <h3 className="text-xl font-display text-gradient-sacred mb-2">
          {existingTrack ? 'Replace' : 'Upload'} Track {slotIndex + 1}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          {defaultTitle} • {defaultFrequency}
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Track Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter track title"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Input
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="e.g., 528Hz"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Audio File *</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/mpeg,audio/mp3,audio/wav,audio/wave,audio/x-wav,audio/ogg,audio/flac,audio/aac,audio/m4a,.mp3,.wav,.ogg,.flac,.aac,.m4a"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 w-full flex items-center justify-center gap-2 p-8 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              {file ? (
                <div className="flex items-center gap-2 text-primary">
                  <Music className="h-5 w-5" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                </div>
              ) : existingTrack ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Check className="h-8 w-8 text-primary" />
                  <span className="text-sm">Track already uploaded</span>
                  <span className="text-xs opacity-70">Click to replace with new file</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-8 w-8" />
                  <span className="text-sm">Click to select audio file</span>
                  <span className="text-xs opacity-70">MP3, WAV, OGG, FLAC, AAC, M4A</span>
                </div>
              )}
            </button>
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <Button
            variant="sacred"
            className="w-full"
            onClick={handleUpload}
            disabled={uploading || !file || !title}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {existingTrack ? 'Replace Track' : 'Upload Track'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrackSlotUploader;
