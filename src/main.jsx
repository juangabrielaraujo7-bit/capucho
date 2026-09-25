import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Em produção o HTML já vem pré-renderizado; em desenvolvimento o root chega vazio.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
