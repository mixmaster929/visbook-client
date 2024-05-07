import React from "react";
import { createRoot } from "react-dom/client";
import VisBookComponent from "./VisBookComponent";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import ReactDOM from "react-dom";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationsEn from "./locales/en.json"; // English translations
import translationsNb from "./locales/nb.json"; // French translations
import "./styles/VisBookComponent.scss";

i18next.use(LanguageDetector).init({
  resources: {
    en: {
      translation: translationsEn,
    },
    nb: {
      translation: translationsNb,
    },
  },
  fallbackLng: "en", // Fallback language if translation not found
  interpolation: {
    escapeValue: false, // React already does escaping
  },
});
ReactDOM.hydrate(
  <React.StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18next}>
        <VisBookComponent />
      </I18nextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("visbook-root")
);
// Define the root element where your React component will be mounted
// const rootElement = document.getElementById("visbook-root");

// Check if the root element exists before rendering the component
// if (rootElement) {
//   const root = createRoot(rootElement); // Create a root.
//   root.render(
//     <React.StrictMode>
//       <BrowserRouter>
//         <I18nextProvider i18n={i18next}>
//           <VisBookComponent />
//         </I18nextProvider>
//       </BrowserRouter>
//     </React.StrictMode>
//   );
// } else {
//   console.error(
//     'Root element "visbook-root" not found. Make sure it exists in your HTML.'
//   );
// }
