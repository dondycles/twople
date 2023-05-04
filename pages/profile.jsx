import {
  BsFillBagHeartFill,
  BsSendFill,
  BsGenderFemale,
  BsGenderMale,
} from "react-icons/bs";
import { TbGenderMale, TbGenderFemale, TbGenderAgender } from "react-icons/tb";

import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/firebase/firebase";
import {
  addDoc,
  doc,
  collection,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export default function Profile() {
  const route = useRouter();
  const [user, setUser] = useState(null);
  const [partner, setPartner] = useState(null);

  const getUser = async () => {
    onSnapshot(doc(db, "users", localStorage.getItem("loggedIn")), (user) => {
      setUser({ id: user.id, ...user.data() });
      onSnapshot(collection(db, "users", user.id, "partner"), (snap) => {
        snap.docs.map((e) => {
          setPartner(e.data());
        });
      });
    });
  };

  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) route.push("/");
    if (localStorage.getItem("loggedIn")) {
      getUser();
    }
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center  py-8 px-4 bg-gradient-to-b from-black to-violet-950`}
    >
      <header className="text-4xl font-black flex gap-2">
        <h1>Twouple</h1>
        <BsFillBagHeartFill />{" "}
      </header>
      <br />
      <div className=" my-4 rounded-2xl bg-violet-900 p-4 md:max-w-[600px] max-w-[300px] min-w-[280px] flex items-center justify-center flex-col gap-4">
        <FaUserCircle className=" text-[48px]" />
        <p className=" text-center text-2xl font-black flex gap-1 items-center justify-center">
          {user && user.nickname}{" "}
          <span className=" font-black bg-white rounded-full text-violet-800  ">
            {(user && user.gender === 0 && <TbGenderMale />) ||
              (user && user.gender === 1 && <TbGenderFemale />) ||
              (user && user.gender === 2 && <TbGenderAgender />)}
          </span>
        </p>
        <p>
          Your partner is{" "}
          <span className=" font-black text-2xl">
            {partner && partner.nickname}
          </span>{" "}
        </p>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("loggedIn");
          route.push("/");
        }}
      >
        Log Out
      </button>
    </main>
  );
}
