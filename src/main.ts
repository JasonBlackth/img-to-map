import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Project } from './app/project/project';
import { Colors } from './app/ts/Model/Colors';


export {};


declare global{
    let cv: any;
    let ActiveProject: Project;
}


async function waitForOpenCv(): Promise<void> {
    while (!(window as any).cv) {
        await new Promise(r => setTimeout(r, 50));
    }
    (window as any).cv = await (window as any).cv
}

await waitForOpenCv(); 
Colors.init();
document.getElementById('openCvLoadingIndicator')?.remove();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

