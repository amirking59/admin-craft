import { createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import qs from "qs";
import { setLogoutHandler } from "@/features/auth/services";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  // One QueryClient, shared with route loaders and guards through the router context.
  const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // qs keeps the nested `filters[status][]=…&page[index]=1` URLs the data table relies on.
    parseSearch: (search) => qs.parse(search, { ignoreQueryPrefix: true }),
    stringifySearch: (search) =>
      qs.stringify(search, { arrayFormat: "brackets", encodeValuesOnly: true, skipNulls: true, addQueryPrefix: true }),
    Wrap: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
  });

  // Logging out (or any 401) drops the cached data of the old session and goes to login, without a reload.
  setLogoutHandler(() => {
    queryClient.clear();
    void router.navigate({ to: "/auth" });
  });

  return router;
}
