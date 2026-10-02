import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: { projectId: "9in9aaz1", dataset: "production" },
  // Endereço do painel publicado: https://capucho.sanity.studio
  studioHost: "capucho",
  deployment: { appId: "ri6nt866u08ze5cp6yvubxcj", autoUpdates: true },
});
