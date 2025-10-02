import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import { createTheme, MantineProvider } from "@mantine/core";
import {
  AppContextProvider,
  AuthContextProvider,
  getQueryParam,
} from "@ixeta/xams";
import "@ixeta/xams/styles.css";
import "@ixeta/xams/global.css";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@ixeta/headless-auth-react";
import { XamsFirebaseAuthProvider } from "@ixeta/xams-firebase";

const queryClient = new QueryClient();

const theme = createTheme({});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const userId = getQueryParam("userid", router.asPath);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <XamsFirebaseAuthProvider apiUrl={process.env.NEXT_PUBLIC_API ?? ""}>
          {(context) => (
            <AuthProvider authConfig={context.firebaseAuthConfig}>
              <AuthContextProvider
                apiUrl={process.env.NEXT_PUBLIC_API as string}
                headers={{
                  UserId: userId as string,
                }}
                onUnauthorized={() => {
                  context.firebaseAuthConfig?.signOut();
                  if (router.isReady) {
                    router.push("/");
                  }
                }}
                getAccessToken={context.firebaseAuthConfig?.getAccessToken}
              >
                <AppContextProvider>
                  <Notifications />
                  <Component {...pageProps} />
                  <div id="auth-recaptcha" className="invisible" />
                </AppContextProvider>
              </AuthContextProvider>
            </AuthProvider>
          )}
        </XamsFirebaseAuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
