"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

const Registration = () => {
  //Form variabels
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  //Response variabels
  const [userDataDeliverd, setUserDataDeliverd] = useState<string | null>(null);
  const [responseError, setResponseError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  //Input errors
  const [errorName, setErrorName] = useState<string | null>(null);
  const [errorSurname, setErrorSurname] = useState<string | null>(null);
  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    if (!name) {
      setErrorName("Musíte zadať meno");
      isValid = false;
    } else {
      setErrorName(null);
    }

    if (!surname) {
      setErrorSurname("Musíte zadať priezvisko");
      isValid = false;
    } else {
      setErrorSurname(null);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorEmail("Musíte zadať platnú e-mailovú adresu");
      isValid = false;
    } else {
      setErrorEmail(null);
    }

    if (!password || password.length < 6) {
      setErrorPassword("Heslo musí mať aspoň 6 znakov");
      isValid = false;
    } else {
      setErrorPassword(null);
    }

    if (!isValid) return;

    setPending(true);
    const data = { name, surname, email, password };

    try {
      const response = await fetch(`${API_URL}/registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();
      console.log(result);
      if (!response.ok) {
        if (result === "Použivateľ už existuje") {
          setResponseError(result);
        }
        setPending(false);
      } else {
        setPending(false);

        router.push("/prihlasenie");
      }
    } catch (error: any) {
      console.error("Chyba pri registrácii:", error.message);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen px-4 py-10">
      <form
        onSubmit={submitForm}
        className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md space-y-5"
      >
        <h2 className="text-black text-center text-2xl font-bold">
          Registrácia
        </h2>

        {responseError && (
          <div className="text-center">
            <p className="text-red-500 font-bold mb-2">{responseError}</p>
            <Link
              href="/prihlasenie"
              className="underline text-blue-700 hover:text-blue-900 text-sm"
            >
              Prihlásiť sa
            </Link>
          </div>
        )}

        {!pending && (
          <>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium">Meno</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-style"
                />
                {errorName && (
                  <p className="text-red-500 text-sm">{errorName}</p>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium">Priezvisko</label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="input-style"
                />
                {errorSurname && (
                  <p className="text-red-500 text-sm">{errorSurname}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-style"
              />
              {errorEmail && (
                <p className="text-red-500 text-sm">{errorEmail}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium">Heslo</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-style"
              />
              {errorPassword && (
                <p className="text-red-500 text-sm">{errorPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 m-0 rounded-md hover:bg-blue-700 transition"
            >
              Potvrdiť
            </button>
          </>
        )}

        {pending && (
          <p className="text-center text-blue-800 font-semibold">
            Kontroluje sa ...
          </p>
        )}
      </form>
    </section>
  );
};

export default Registration;
