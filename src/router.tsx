import { createRouter } from "@tanstack/react-router";
import qs from "qs";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    // qs keeps the nested `filters[status][]=…&page[index]=1` URLs the data table relies on.
    parseSearch: (search) => qs.parse(search, { ignoreQueryPrefix: true }),
    stringifySearch: (search) =>
      qs.stringify(search, { arrayFormat: "brackets", encodeValuesOnly: true, skipNulls: true, addQueryPrefix: true }),
  });
}
