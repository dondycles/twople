import "@/styles/globals.css";
import Nav from "@/components/nav";
import { useRouter } from "next/router";
export default function App({ Component, pageProps }) {
  const route = useRouter();
  return (
    <main className=" text-white">
      {route.pathname != "/" && <Nav />}
      <Component {...pageProps} />
    </main>
  );
}
