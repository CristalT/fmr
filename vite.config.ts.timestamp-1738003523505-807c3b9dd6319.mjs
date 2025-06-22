// vite.config.ts
import { defineConfig } from "file:///Users/marcelo.forclaz/dev/fmr-site/node_modules/.pnpm/vite@5.3.5_@types+node@20.14.12/node_modules/vite/dist/node/index.js";
import { getDirname } from "file:///Users/marcelo.forclaz/dev/fmr-site/node_modules/.pnpm/@adonisjs+core@6.12.1_@adonisjs+assembler@7.7.0_typescript@5.5.4__@vinejs+vine@1.8.0_edge.js@6.0.2/node_modules/@adonisjs/core/build/src/helpers/main.js";
import inertia from "file:///Users/marcelo.forclaz/dev/fmr-site/node_modules/.pnpm/@adonisjs+inertia@1.0.0-23_@adonisjs+core@6.12.1_@adonisjs+assembler@7.7.0_typescript@5.5.4___75ynwces4jg6dyivut6xaob6aq/node_modules/@adonisjs/inertia/build/src/plugins/vite.js";
import vue from "file:///Users/marcelo.forclaz/dev/fmr-site/node_modules/.pnpm/@vitejs+plugin-vue@5.1.0_vite@5.3.5_@types+node@20.14.12__vue@3.4.34_typescript@5.5.4_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import adonisjs from "file:///Users/marcelo.forclaz/dev/fmr-site/node_modules/.pnpm/@adonisjs+vite@3.0.0_@adonisjs+core@6.12.1_@adonisjs+assembler@7.7.0_typescript@5.5.4__@vinej_elc2i7zfkdkyoijtcxc2eaf7ee/node_modules/@adonisjs/vite/build/src/client/main.js";
var __vite_injected_original_import_meta_url = "file:///Users/marcelo.forclaz/dev/fmr-site/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: "inertia/app/ssr.ts" } }),
    vue(),
    adonisjs({ entrypoints: ["inertia/app/app.ts"], reload: ["resources/views/**/*.edge"] })
  ],
  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      "~/": `${getDirname(__vite_injected_original_import_meta_url)}/inertia/`
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWFyY2Vsby5mb3JjbGF6L2Rldi9mbXItc2l0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21hcmNlbG8uZm9yY2xhei9kZXYvZm1yLXNpdGUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21hcmNlbG8uZm9yY2xhei9kZXYvZm1yLXNpdGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgZ2V0RGlybmFtZSB9IGZyb20gJ0BhZG9uaXNqcy9jb3JlL2hlbHBlcnMnXG5pbXBvcnQgaW5lcnRpYSBmcm9tICdAYWRvbmlzanMvaW5lcnRpYS9jbGllbnQnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBhZG9uaXNqcyBmcm9tICdAYWRvbmlzanMvdml0ZS9jbGllbnQnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBpbmVydGlhKHsgc3NyOiB7IGVuYWJsZWQ6IHRydWUsIGVudHJ5cG9pbnQ6ICdpbmVydGlhL2FwcC9zc3IudHMnIH0gfSksXG4gICAgdnVlKCksXG4gICAgYWRvbmlzanMoeyBlbnRyeXBvaW50czogWydpbmVydGlhL2FwcC9hcHAudHMnXSwgcmVsb2FkOiBbJ3Jlc291cmNlcy92aWV3cy8qKi8qLmVkZ2UnXSB9KSxcbiAgXSxcblxuICAvKipcbiAgICogRGVmaW5lIGFsaWFzZXMgZm9yIGltcG9ydGluZyBtb2R1bGVzIGZyb21cbiAgICogeW91ciBmcm9udGVuZCBjb2RlXG4gICAqL1xuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICd+Lyc6IGAke2dldERpcm5hbWUoaW1wb3J0Lm1ldGEudXJsKX0vaW5lcnRpYS9gLFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyUixTQUFTLG9CQUFvQjtBQUN4VCxTQUFTLGtCQUFrQjtBQUMzQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sY0FBYztBQUp5SixJQUFNLDJDQUEyQztBQU0vTixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxRQUFRLEVBQUUsS0FBSyxFQUFFLFNBQVMsTUFBTSxZQUFZLHFCQUFxQixFQUFFLENBQUM7QUFBQSxJQUNwRSxJQUFJO0FBQUEsSUFDSixTQUFTLEVBQUUsYUFBYSxDQUFDLG9CQUFvQixHQUFHLFFBQVEsQ0FBQywyQkFBMkIsRUFBRSxDQUFDO0FBQUEsRUFDekY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTUEsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsTUFBTSxHQUFHLFdBQVcsd0NBQWUsQ0FBQztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
