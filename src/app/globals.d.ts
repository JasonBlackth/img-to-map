export {};

declare global {
  const cv: any;
  interface Window {
    Module: any;
    cv: any;
    openCvReady: Promise<void>;
    ActiveProject: Project;
  }
}
