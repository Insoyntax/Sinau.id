// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: { preset: "vercel" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    build: {
      sourcemap: false, // Menonaktifkan sourcemap di production untuk mengurangi ukuran hasil build
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Memisahkan dependencies (node_modules) menjadi file terpisah agar browser bisa melakukan cache lebih efisien
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom")) {
                return "react-vendor";
              }
              if (id.includes("@tanstack")) {
                return "tanstack-vendor";
              }
              if (id.includes("lucide-react")) {
                return "icons-vendor";
              }
              return "vendor"; // Sisa library lainnya akan masuk ke chunk 'vendor'
            }
          },
        },
      },
    },
    esbuild: {
      // Secara otomatis menghapus semua console.log() dan debugger di environment production
      drop: ["console", "debugger"],
    },
  },
});
