import { BsFillBagHeartFill, BsCloudUpload } from "react-icons/bs";
import { TbGenderMale, TbGenderFemale, TbGenderAgender } from "react-icons/tb";
import { useState, useEffect, useRef } from "react";
import { db } from "@/firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import * as htmlToImage from "html-to-image";
import { useRouter } from "next/router";

export default function Landing() {
  const [uuid, setUuid] = useState(null);
  const [showLogIn, setShowLogIn] = useState(false);
  const [inputQr, setInputQr] = useState(null);
  const [index, setIndex] = useState(0);
  const [gender, setGender] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [partnerID, setPartnerID] = useState(null);
  const qrSVG = useRef(null);
  const route = useRouter();

  const fetchRequest = (formData) => {
    fetch("https://api.qrserver.com/v1/read-qr-code/", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(async (result) => {
        result = result[0].symbol[0].data;
        console.log(result);
        setInputQr(result);
        const user = await getDoc(doc(db, "users", result));
        if (user.exists()) localStorage.setItem("loggedIn", user.id);
        route.push("/home");
      });
  };

  useEffect(() => {
    setUuid(`${nickname + "-" + uuidv4()}`);
  }, [nickname, gender]);

  useEffect(() => {
    if (localStorage.getItem("loggedIn")) route.push("/home");
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center py-8 px-4 bg-gradient-to-b from-black to-violet-950`}
    >
      <header className="text-4xl font-black flex gap-2">
        <h1>Twouple</h1>
        <BsFillBagHeartFill />{" "}
      </header>
      <br />
      {!showLogIn && (
        <div className=" my-4 rounded-2xl flex flex-col gap-y-4 bg-violet-900 p-4 md:max-w-[600px] max-w-[300px] min-w-[280px] ">
          <header className=" bg-violet-950 rounded-xl p-4">
            <h1 className=" text-3xl font-black text-center">
              {index === 0 && "Welcome!"}
              {index === 1 && "Set Up"}
              {index > 1 && `Hello, ${localStorage.getItem("nickname")}!`}
            </h1>
            <h2 className=" mt-2 text-center ">
              {index === 0 &&
                "Kindly read the guidlines below to learn more about Twouple"}
              {index === 1 && "Tell me something about you"}
              {index > 1 &&
                `Save your QR Code below. It will serve as your credentials for future log-ins and to connect with your partner .`}
            </h2>
            <div className=" mt-4">
              {index === 0 && (
                <>
                  <p className=" indent-4">
                    • Twouple is made for couples to help them know each other
                    more by answering random questions.
                  </p>
                  <p className=" indent-4">
                    • Each individual will answer the same question and its
                    answers will only be visible if both of them have already
                    answered.
                  </p>
                </>
              )}
              {index === 1 && (
                <div className=" flex flex-col justify-center items-center gap-2  bg-violet-950 rounded-xl ">
                  <input
                    type="text"
                    placeholder="your nickname only"
                    className="p-4 rounded-full bg-violet-900"
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <div className=" flex items-center gap-2">
                    <div className=" flex items-center justify-center h-full gap-2">
                      <div
                        className={` buttonMouseEffects rounded-full ${
                          gender === 0 && "bg-violet-900"
                        }`}
                      >
                        <TbGenderMale
                          role="button"
                          tabIndex={0}
                          className=" text-5xl p-2"
                          onClick={() => setGender(0)}
                        />
                      </div>
                      <div
                        className={` buttonMouseEffects rounded-full ${
                          gender === 1 && "bg-violet-900"
                        }`}
                      >
                        <TbGenderFemale
                          role="button"
                          tabIndex={0}
                          className=" text-5xl p-2"
                          onClick={() => setGender(1)}
                        />
                      </div>
                      <div
                        className={` buttonMouseEffects rounded-full ${
                          gender === 2 && "bg-violet-900"
                        }`}
                      >
                        <TbGenderAgender
                          role="button"
                          tabIndex={0}
                          className=" text-5xl p-2"
                          onClick={() => setGender(2)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </header>
          {index < 2 && (
            <footer className="  bg-violet-950  overflow-hidden rounded-full flex items-center gap-2">
              <button
                onClick={() => {
                  if (index === 1 && nickname === null) return;
                  if (index < 2) setIndex((prev) => prev + 1);
                  if (index === 1) {
                    localStorage.setItem("nickname", nickname);
                    localStorage.setItem("gender", gender);
                  }
                }}
                className=" w-full p-4 buttonMouseEffects"
              >
                {index === 0 && "Okay, next!"}
                {index === 1 && "Done!"}
                {index === 2 && "Save"}
              </button>
            </footer>
          )}
        </div>
      )}
      {index > 1 && !showLogIn && (
        <div className="flex items-center justify-center gap-4 flex-col p-4 bg-violet-900 rounded-2xl min-w-[280px]">
          <QRCodeSVG
            id="qr"
            ref={qrSVG}
            className="  rounded-xl flex flex-col gap-y-4 bg-violet-950 p-4 w-full min-h-[200px] "
            value={String(uuid)}
          ></QRCodeSVG>
          <p className=" bg-violet-950 rounded-full p-4">{uuid}</p>
          {index === 2 && (
            <button
              className=" w-full p-4 buttonMouseEffects bg-violet-950 rounded-full"
              onClick={async () => {
                try {
                  const qr = document.getElementById("qr");
                  const blob = await htmlToImage.toBlob(qr);
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.download = nickname;
                  a.href = url;
                  a.click();
                  await setDoc(doc(db, "users", uuid), {
                    nickname: nickname,
                    gender: gender,
                    id: uuid,
                  })
                    .then(localStorage.setItem("loggedIn", nickname + uuid))
                    .then(setIndex((prev) => prev + 1));
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              Save QR
            </button>
          )}
          {index === 3 && (
            <div className=" flex flex-row gap-4 w-full">
              <button
                className=" w-full p-4 buttonMouseEffects bg-violet-950 rounded-full"
                onClick={async () => {
                  try {
                    const qr = document.getElementById("qr");
                    const blob = await htmlToImage.toBlob(qr);
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.download = nickname;
                    a.href = url;
                    a.click();
                    await setDoc(doc(db, "users", uuid), {
                      nickname: nickname,
                      gender: gender,
                      id: uuid,
                    }).then(localStorage.setItem("loggedIn", nickname + uuid));
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                Save QR
              </button>
              <button
                className=" w-full p-4 buttonMouseEffects bg-violet-950 rounded-full"
                onClick={() => {
                  setShowLogIn(true);
                }}
              >
                Log In
              </button>
            </div>
          )}
        </div>
      )}

      {showLogIn && (
        <div
          id="canvas"
          role="button"
          tabIndex={0}
          onClick={() => document.getElementById("qrInput").click()}
          className=" my-4 rounded-2xl flex flex-col gap-y-4 bg-violet-900 p-4 md:max-w-[600px] max-w-[300px] min-w-[280px] min-h-[200px]  buttonMouseEffects items-center justify-center"
        >
          <input
            id="qrInput"
            onChange={(e) => {
              let file = e.target.files[0];
              let formData = new FormData();
              formData.append("file", file);
              fetchRequest(formData);
            }}
            type="file"
            className=" hidden"
          />
          <BsCloudUpload className=" text-6xl" />
          <p>Click here to upload your QR Code</p>
          {inputQr}
        </div>
      )}

      <p
        role="button"
        tabIndex={0}
        className="underline mt-4"
        onClick={() => setShowLogIn((prev) => !prev)}
      >
        {showLogIn ? " New user? " : " Existing user? "}
      </p>
    </main>
  );
}
