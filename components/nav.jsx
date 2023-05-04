import { useRouter } from "next/router";
export default function Nav() {
  const route = useRouter();
  return (
    <nav className=" overflow-hidden fixed flex items-center justify-center bottom-0 left-[50%] translate-x-[-50%] w-[calc(100%-32px)] h-10 bg-violet-900 rounded-t-3xl font-black">
      <ul className="flex justify-around items-center w-full text-center ">
        <li
          role="button"
          tabIndex={0}
          onClick={() => route.push("/home")}
          className={`  leading-[56px] w-1/2 ${
            route.pathname === "/home" ? " bg-zinc-800" : "buttonMouseEffects"
          }`}
        >
          Home
        </li>
        <li
          role="button"
          tabIndex={0}
          onClick={() => route.push("/profile")}
          className={`  leading-[56px] w-1/2 ${
            route.pathname === "/profile"
              ? " bg-zinc-800"
              : "buttonMouseEffects"
          }`}
        >
          Profile
        </li>
      </ul>
    </nav>
  );
}
