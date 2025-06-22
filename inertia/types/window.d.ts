export {}

declare global {
  interface Window {
    onloadCallback: () => void;
    grecaptcha: any; // You might want to add proper types for grecaptcha as well
  }
}
