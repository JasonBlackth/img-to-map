export {};

declare global {
  const cv: any;
  interface Window {
    cv: any;
    ActiveProject: Project;
  }
}
