"use client";

import { ApolloProvider as ApolloHooksProvider } from "@apollo/client";
import { ReactNode } from "react";
import createApolloClient from "../apollo-client";

const client = createApolloClient();

export const ApolloProvider = ({ children }: { children: ReactNode }) => {
  return <ApolloHooksProvider client={client}>{children}</ApolloHooksProvider>;
};
