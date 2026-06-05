import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api.example.com/upload';

  uploadFiles(mp4: File, srt: File, audio?: File): Observable<any> {
    const formData = new FormData();
    formData.append('video', mp4, mp4.name);
    formData.append('subtitle', srt, srt.name);
    if (audio) {
      formData.append('audio', audio, audio.name);
    }
    return this.http.post(this.apiUrl, formData);
  }

  uploadSingle(file: File, type: 'video' | 'subtitle'): Observable<any> {
    const formData = new FormData();
    formData.append(type, file, file.name);
    return this.http.post(this.apiUrl, formData);
  }
}
