import "./assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import "vant/lib/index.css";
import { Calendar, Cell, CellGroup } from "vant";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(Calendar);
app.use(Cell);
app.use(router);

app.mount("#app");
