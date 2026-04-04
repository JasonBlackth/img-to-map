import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Colors } from './app/ts/Model/Colors';

async function waitForOpenCv(): Promise<void> {
  while (!(window as any).cv) {
    await new Promise((r) => setTimeout(r, 50));
  }
  (window as any).cv = await (window as any).cv;
}

await waitForOpenCv();
Colors.init();
document.getElementById('openCvLoadingIndicator')?.remove();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
