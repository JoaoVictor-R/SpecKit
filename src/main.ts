import "./styles.css";
import { mountApp } from "./app";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("Não foi possível iniciar a aplicação: elemento #app ausente.");
}

mountApp(root);
