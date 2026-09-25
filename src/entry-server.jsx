import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";

export { routes, getSeo, localBusinessJsonLd } from "./seo";

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}
