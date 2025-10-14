import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import { createTheme, MantineProvider } from "@mantine/core";
import { AppContextProvider, getQueryParam } from "@ixeta/xams";
import "@ixeta/xams/styles.css";
import "@ixeta/xams/global.css";
import "@ixeta/xams-firebase/styles.css";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XamsFirebaseAuthProvider } from "@ixeta/xams-firebase";

const queryClient = new QueryClient();

const theme = createTheme({});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const userId = getQueryParam("userid", router.asPath);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <XamsFirebaseAuthProvider
          apiUrl={process.env.NEXT_PUBLIC_API ?? ""}
          headers={{
            UserId: userId as string,
          }}
          onUnauthorized={(context) => {
            context.firebaseAuthConfig?.signOut();
            if (router.isReady) {
              router.push("/");
            }
          }}
        >
          <AppContextProvider>
            <Notifications />
            <Component {...pageProps} />
            <div id="auth-recaptcha" className="invisible" />
          </AppContextProvider>
        </XamsFirebaseAuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
