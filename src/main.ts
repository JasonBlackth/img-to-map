import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

export function initApp(): void {
  document.querySelector('#openCvLoadingIndicator')?.remove();

  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
}

await window.openCvReady;
initApp();
