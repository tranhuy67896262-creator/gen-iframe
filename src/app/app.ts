import { Component, signal } from '@angular/core';
import { DisplayPanelComponent } from './components/display-panel/display-panel';
import { UploadPanelComponent } from './components/upload-panel/upload-panel';

@Component({
  selector: 'app-root',
  imports: [DisplayPanelComponent, UploadPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly activeTab = signal<'display' | 'upload'>('display');

  setTab(tab: 'display' | 'upload'): void {
    this.activeTab.set(tab);
  }
}
