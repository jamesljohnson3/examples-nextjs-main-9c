


import { ApolloWrapper } from "./ApolloWrapper";


export default async function Layout({ children }: React.PropsWithChildren) {

  
  return <ApolloWrapper>{children}</ApolloWrapper>;
}
