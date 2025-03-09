"use client";

import { SessionProvider as Provider } from "next-auth/react";

export default function SessionProvider({
  children,
  ...props
}: React.ComponentProps<typeof Provider>) {
  return (
    <Provider
      baseUrl="/"
      refetchOnWindowFocus={false}
      refetchInterval={10e3}
      {...props}
    >
      {children}
    </Provider>
  );
}
