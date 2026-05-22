'use client';
import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { mediaApi, usersApi, getErrorMessage } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Props {
  name: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  onUploaded?: (url: string) => void;
  editable?: boolean;
}

const SIZE = { sm: 40, md: 64, lg: 96 };
const TEXT = { sm: 'text-sm', md: 'text-xl', lg: 'text-3xl' };

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

async function resizeToJpeg(file: File, maxPx = 400): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')), 'image/jpeg', 0.88);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function AvatarUpload({ name, avatarUrl, size = 'md', onUploaded, editable = true }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const px = SIZE[size];

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setError('');
    setUploading(true);
    try {
      const blob = await resizeToJpeg(file);
      const { uploadUrl, fileUrl } = await mediaApi.presign('avatar.jpg', 'image/jpeg');
      await fetch(uploadUrl, {
        method: 'PUT',
        body: blob,
        headers: { 'Content-Type': 'image/jpeg' },
      });
      await usersApi.updateProfile({ avatarUrl: fileUrl });
      onUploaded?.(fileUrl);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={() => editable && inputRef.current?.click()}
        disabled={uploading}
        className={cn(
          'relative rounded-2xl overflow-hidden shrink-0 group',
          editable && 'cursor-pointer',
        )}
        style={{ width: px, height: px }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className={cn(
            'w-full h-full bg-rock-600 flex items-center justify-center',
            TEXT[size],
          )}>
            <span className="font-bold text-white">{initials(name)}</span>
          </div>
        )}

        {editable && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {uploading
              ? <Loader2 className="w-5 h-5 text-white animate-spin" />
              : <Camera className="w-5 h-5 text-white" />
            }
          </div>
        )}
      </button>

      {error && <p className="text-xs text-red-500 text-center max-w-[160px]">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
