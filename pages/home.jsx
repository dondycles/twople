import { BsFillBagHeartFill, BsSendFill } from "react-icons/bs";
import { BiCopyAlt } from "react-icons/bi";
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
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
export default function Home() {
  const route = useRouter();
  const [user, setUser] = useState(null);
  const [partnerID, setPartnerID] = useState(null);
  const [partnerReqData, setPartnerReqData] = useState(null);
  const [partnerReqSent, setPartnerReqSent] = useState(null);
  const getUser = async () => {
    onSnapshot(doc(db, "users", localStorage.getItem("loggedIn")), (user) => {
      setUser({ id: user.id, ...user.data() });
      getPartnerRequest(user.id);
      getPartnerRequestSent(user.id);
    });
  };
  const getPartnerRequest = async (id) => {
    onSnapshot(collection(db, "users", id, "partnerRequest"), (snap) => {
      snap.docs.map((e) => {
        setPartnerReqData(e.data());
      });
    });
  };
  const getPartnerRequestSent = async (id) => {
    onSnapshot(collection(db, "users", id, "partnerRequestSent"), (snap) => {
      snap.docs.map((e) => {
        setPartnerReqSent(e.data());
      });
    });
  };
  const connectPartner = async (id) => {
    if (id === user.id) return alert("error");
    const partnerData = await getDoc(doc(db, "users", id));
    if (partnerData.exists()) {
      await setDoc(doc(db, "users", id, "partnerRequest", user.id), {
        ...user,
      });
      await setDoc(doc(db, "users", user.id, "partnerRequestSent", id), {
        ...partnerData.data(),
      });
    }
  };
  const acceptPartner = async () => {
    const date = new Date();
    const partnerData = await getDoc(doc(db, "users", partnerReqData.id));
    await setDoc(doc(db, "partners", `${user.id} + ${partnerReqData.id}`), {
      partnerSince: String(date.toLocaleDateString()),
      partnerSinceNow: String(Date.now()),
    });

    await updateDoc(doc(db, "users", user.id), {
      isPartnered: true,
    });

    await updateDoc(doc(db, "users", partnerReqData.id), {
      isPartnered: true,
    });

    await setDoc(
      doc(
        db,
        "partners",
        `${user.id} + ${partnerReqData.id}`,
        "partner1",
        user.nickname
      ),
      {
        ...user,
      }
    );

    await setDoc(
      doc(
        db,
        "partners",
        `${user.id} + ${partnerReqData.id}`,
        "partner2",
        partnerData.data().nickname
      ),
      {
        ...partnerData.data(),
      }
    );

    await setDoc(doc(db, "users", partnerReqData.id, "partner", user.id), {
      ...user,
    });

    await setDoc(doc(db, "users", user.id, "partner", partnerReqData.id), {
      ...partnerData.data(),
    });

    await deleteDoc(
      doc(db, "users", user.id, "partnerRequest", partnerReqData.id)
    );
    await deleteDoc(
      doc(db, "users", partnerReqData.id, "partnerRequestSent", user.id)
    );
    location.reload();
  };
  const rejectPartner = async () => {
    await deleteDoc(
      doc(db, "users", user.id, "partnerRequest", partnerReqData.id)
    );
    location.reload();
  };
  const cancelRequest = async () => {
    await deleteDoc(
      doc(db, "users", partnerReqSent.id, "partnerRequest", user.id)
    );
    await deleteDoc(
      doc(db, "users", user.id, "partnerRequestSent", partnerReqSent.id)
    );
    location.reload();
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
      {user &&
        user.isPartnered != true &&
        !partnerReqData &&
        !partnerReqSent && (
          <div className=" my-4 rounded-2xl bg-violet-900 p-4 md:max-w-[600px] max-w-[300px] min-w-[280px]  ">
            <header>
              <h1 className=" text-2xl font-black text-center">
                Connect with your partner!
              </h1>
            </header>
            <br />
            <p className=" mb-4">
              Welcome {(user && user.nickname) || "..."}! You can now try
              connect with your partner. You can send your code or get your
              partner's code and connect!
            </p>
            <div className=" flex items-center justify-between mb-4 bg-violet-950 rounded-full p-4">
              <p className=" text-violet-500 text-sm">
                <span className=" "> {(user && user.id) || "..."}</span>
              </p>
              <BiCopyAlt
                role="button"
                onClick={() =>
                  navigator.clipboard.writeText(user.id).then(alert("Copied!"))
                }
                tabIndex={0}
                className="text-2xl outline-none border-none hover:rotate-45 active:scale-110"
              />
            </div>
            <footer className=" bg-violet-950 p-4 rounded-full flex items-center gap-2 text-sm">
              <input
                type="text"
                placeholder="Your partner's code here..."
                onChange={(e) => {
                  setPartnerID(e.target.value);
                }}
                className=" leading-[24px] w-full bg-transparent outline-none border-none"
              />
              <BsSendFill
                role="button"
                tabIndex={0}
                onClick={() => connectPartner(partnerID)}
                className=" text-2xl outline-none border-none hover:rotate-45 active:scale-110"
              />
            </footer>
          </div>
        )}
      {partnerReqSent && (
        <div className=" my-4 rounded-2xl bg-violet-900 p-4 md:max-w-[600px] max-w-[300px] min-w-[280px]  ">
          <header>
            <h1 className="text-2xl font-black text-center">
              Partner Request Sent
            </h1>
          </header>
          <br />
          <p>
            You have requested{" "}
            <span className=" font-black text-2xl">
              {partnerReqSent.nickname}
            </span>{" "}
            to be your partner.
          </p>

          <footer className=" flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => cancelRequest()}
              className=" buttonMouseEffects flex-1 bg-violet-950 p-4 rounded-full"
            >
              Cancel
            </button>
          </footer>
        </div>
      )}
      {partnerReqData && (
        <div className=" my-4 rounded-2xl bg-violet-900 p-4 md:max-w-[600px] max-w-[300px]  ">
          <header>
            <h1 className="text-2xl font-black text-center">Partner Request</h1>
          </header>
          <br />
          <p>
            <span className=" font-black text-2xl">
              {partnerReqData.nickname}{" "}
            </span>
            is requesting to be your partner.
          </p>

          <footer className=" flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => acceptPartner()}
              className=" buttonMouseEffects flex-1 bg-violet-950 p-4 rounded-full"
            >
              Accept
            </button>
            <button
              onClick={() => rejectPartner()}
              className=" buttonMouseEffects flex-1 bg-violet-950 p-4 rounded-full"
            >
              Reject
            </button>
          </footer>
        </div>
      )}
    </main>
  );
}
