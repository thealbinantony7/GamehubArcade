import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import { initVitalsTracking } from "./services/vitals.ts";
import "./index.css";

// Initialize Web Vitals tracking
initVitalsTracking();

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
