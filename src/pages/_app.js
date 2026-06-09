import "@/styles/globals.css";
import "@/styles/event.css";
import "@/styles/calendar.css";

import Layout from "@/components/layout";
import { AuthProvider } from "@/utils/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
