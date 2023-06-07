import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    target: "node18",
    lib: {
      entry: "./src/index.ts",
      name: "SubmarinConverterPluginCjp",
      fileName: "index",
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: ["cross-fetch", "fetch-cookie"],
      output: {
        globals: {
          "cross-fetch": "cross-fetch",
          "fetch-cookie": "fetch-cookie",
        },
      },
    },
  },
  plugins: [dts()],
})
