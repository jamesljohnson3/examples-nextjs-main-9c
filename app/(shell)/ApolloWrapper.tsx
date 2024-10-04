"use client";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  InMemoryCache,
  ApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support";
import { setVerbosity } from "ts-invariant";

setVerbosity("debug");

function createApolloClient(token: string | null) {
  const httpLink = new HttpLink({
    uri: "https://testunlimitednow222.stellate.sh",
    fetchOptions: { cache: "no-store" },
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const [client, setClient] = useState<ApolloClient<any> | null>(null);

  useEffect(() => {
    const initializeClient = async () => {
      const session = await getSession();
      const token = session?.user?.token || "";
      const apolloClient = createApolloClient(token);
      setClient(apolloClient);
    };

    initializeClient();
  }, []);

  if (!client) {
    // Render a loading spinner or message while the client is being initialized
    return <div>Loading...</div>;
  }

  return <ApolloNextAppProvider makeClient={() => client}>{children}</ApolloNextAppProvider>;
}
