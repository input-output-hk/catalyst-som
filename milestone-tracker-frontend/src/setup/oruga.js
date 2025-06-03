import Oruga from "@oruga-ui/oruga-next";
import { bulmaConfig } from "@oruga-ui/theme-bulma";

import "@/assets/sass/main.scss";

export default function setupOruga(app) {
  app.use(Oruga, {
    ...bulmaConfig,
    iconComponent: "vue-fontawesome",
    iconPack: "fas",
    bulma: true,
  });
}
