import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Colors } from './app/common/Colors';

export function initApp(): void {
  Colors.init();
  document.querySelector('#openCvLoadingIndicator')?.remove();

  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
}

await window.openCvReady;
initApp();
