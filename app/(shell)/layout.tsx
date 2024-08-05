


import type { ReactNode } from "react";



type RootLayoutProps = {
  children: ReactNode;

};


export default function RootLayout({ children }: RootLayoutProps) {
  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>

      {children}

    </>
  );
}

// -----------------------------------------------------------------------------
// Config
// -----------------------------------------------------------------------------

export const experimental_ppr = true;

