import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Permite que el servidor sea accesible externamente
    port: 3000, // Puerto que Render puede detectar
  },
  preview: {
    host: "0.0.0.0", // Configuración para "vite preview"
    port: 3000, // Puerto que Render puede detectar
  },
});
