/*
 * <<licensetext>>
 */

export {};

declare global {
  const cv: CvNamespace;
  interface Window {
    Module: any;
    openCvReady: Promise<void>;
    ActiveProject: Project;
  }
}
