import { RouterProvider } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { router } from "./routes";
import { LanguageProvider } from "./context/LanguageContext";

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </HelmetProvider>
  );
}
