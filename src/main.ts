import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Project } from './app/project/project';
import { Colours } from './app/ts/Model/Colours';


export {};

declare global {
  interface Window {
    Module: any;
  }
  const cv : any;
  let ActiveProject: Project;
}

const openCvReady = new Promise<void>((resolve) => {
  window.Module = {
    onRuntimeInitialized() {
      console.log("OpenCV is ready");
      resolve();
    }
  };
});

await openCvReady;
Colours.init();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

