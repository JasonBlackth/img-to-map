/*
 * <<licensetext>>
 */

export {};

declare global {
  const cv: CvNamespace;
  interface Window {
    Module: unknown;
    openCvReady: Promise<void>;
    ActiveProject: Project;
  }
}
