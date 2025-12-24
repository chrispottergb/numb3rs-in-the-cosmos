import { useState, useRef } from 'react';
import { Upload, Music, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AudioUploaderProps {
  onUploadComplete: () => void;
  onClose: () => void;
}

const AudioUploader = ({ onUploadComplete, onClose }: AudioUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('');
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
      
      // Check MIME type or file extension for WAV files (some browsers report different types)
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      const isValidType = validTypes.includes(selectedFile.type) || 
        ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(fileExt || '');
      
      if (!isValidType) {
        toast.error('Please select a valid audio file (MP3, WAV, OGG, FLAC, AAC, M4A)');
        return;
      }
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !title) {
      toast.error('Please provide a title and select a file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Use XMLHttpRequest for progress tracking
      const formData = new FormData();
      formData.append('file', file);

      const { data: { session } } = await supabase.auth.getSession();
      
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });
        
        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        xhr.open('POST', `${supabaseUrl}/storage/v1/object/audio-tracks/${fileName}`);
        xhr.setRequestHeader('Authorization', `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`);
        xhr.setRequestHeader('x-upsert', 'true');
        xhr.send(file);
      });

      const { data: { publicUrl } } = supabase.storage
        .from('audio-tracks')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('audio_tracks')
        .insert({
          title,
          frequency: frequency || null,
          file_url: publicUrl,
          description: `Uploaded track: ${title}`,
        });

      if (insertError) throw insertError;

      toast.success('Track uploaded successfully!');
      onUploadComplete();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload track');
    } finally {
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

        <h3 className="text-xl font-display text-gradient-sacred mb-6">
          Upload Audio Track
        </h3>

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
            <Label htmlFor="frequency">Frequency (optional)</Label>
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
                Upload Track
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AudioUploader;
