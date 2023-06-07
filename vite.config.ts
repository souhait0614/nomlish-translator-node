import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "SubmarinConverterPluginCjp",
      fileName: "index",
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: ["axios", "axios-cookiejar-support", "tough-cookie"],
      output: {
        globals: {
          axios: "axios",
          "axios-cookiejar-support": "axios-cookiejar-support",
          "tough-cookie": "tough-cookie",
        },
      },
    },
  },
  plugins: [dts()],
})
