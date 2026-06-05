import { Component, DestroyRef, inject, signal } from '@angular/core';
import { UploadService } from '../../services/upload.service';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

@Component({
  selector: 'app-upload-panel',
  standalone: true,
  imports: [],
  templateUrl: './upload-panel.html',
  styleUrl: './upload-panel.css',
})
export class UploadPanelComponent {
  private readonly uploadService = inject(UploadService);

  protected mp4File = signal<File | null>(null);
  protected srtFile = signal<File | null>(null);
  protected audioFile = signal<File | null>(null);
  protected status = signal<UploadStatus>('idle');
  protected errorMessage = signal('');
  protected videoPreviewUrl = signal<string | null>(null);
  protected audioPreviewUrl = signal<string | null>(null);

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.revokePreview();
      this.revokeAudioPreview();
    });
  }

  onMp4Selected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.setMp4File(input.files[0]);
    }
  }

  onSrtSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.srtFile.set(input.files[0]);
    }
  }

  onAudioSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.setAudioFile(input.files[0]);
    }
  }

  onMp4Drop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.type === 'video/mp4') {
      this.setMp4File(file);
    }
  }

  onSrtDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.name.endsWith('.srt')) {
      this.srtFile.set(file);
    }
  }

  onAudioDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && (file.type === 'audio/wav' || file.type === 'audio/mpeg')) {
      this.setAudioFile(file);
    }
  }

  preventDefault(event: DragEvent): void {
    event.preventDefault();
  }

  removeMp4(): void {
    this.revokePreview();
    this.mp4File.set(null);
  }

  removeSrt(): void {
    this.srtFile.set(null);
  }

  removeAudio(): void {
    this.revokeAudioPreview();
    this.audioFile.set(null);
  }

  upload(): void {
    const mp4 = this.mp4File();
    const srt = this.srtFile();
    if (!mp4 || !srt) return;

    this.status.set('uploading');
    this.errorMessage.set('');

    this.uploadService.uploadFiles(mp4, srt, this.audioFile() ?? undefined).subscribe({
      next: () => this.status.set('success'),
      error: (err) => {
        this.status.set('error');
        this.errorMessage.set(err?.message ?? 'Upload failed. Please try again.');
      },
    });
  }

  reset(): void {
    this.revokePreview();
    this.revokeAudioPreview();
    this.mp4File.set(null);
    this.srtFile.set(null);
    this.audioFile.set(null);
    this.status.set('idle');
    this.errorMessage.set('');
  }

  private setMp4File(file: File): void {
    this.revokePreview();
    this.mp4File.set(file);
    this.videoPreviewUrl.set(URL.createObjectURL(file));
  }

  private revokePreview(): void {
    const url = this.videoPreviewUrl();
    if (url) {
      URL.revokeObjectURL(url);
      this.videoPreviewUrl.set(null);
    }
  }

  private setAudioFile(file: File): void {
    this.revokeAudioPreview();
    this.audioFile.set(file);
    this.audioPreviewUrl.set(URL.createObjectURL(file));
  }

  private revokeAudioPreview(): void {
    const url = this.audioPreviewUrl();
    if (url) {
      URL.revokeObjectURL(url);
      this.audioPreviewUrl.set(null);
    }
  }
}
