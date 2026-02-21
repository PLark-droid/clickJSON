import { defineConfig } from "wxt";

export default defineConfig({
  srcDir: "src",
  manifest: {
    name: "clickJSON",
    description: "HRMOS/HERPの求人票ページから構造化JSONを抽出",
    permissions: ["activeTab", "tabs"],
  },
});
