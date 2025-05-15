"use client";
import { useState, FormEvent } from "react";
import { useContext } from "react";
import { LoginRegistrationContext } from "@/app/context/login_registration";
const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string>("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const context = useContext(LoginRegistrationContext);
  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    setResponseMessage("");
    const data = { email, password };

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
      } else {
        const result = await res.json();

        setResponseMessage(result);
        if (result === "Úspešene ste sa prihlásili") {
          context?.setResponse((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Chyba pri prihlasovaní:", error);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen px-4 py-10">
      <form
        onSubmit={submitForm}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md space-y-6"
      >
        <h2 className="text-black text-center text-2xl font-bold">
          Prihlásenie
        </h2>

        {responseMessage &&
          responseMessage !== "Úspešene ste sa prihlásili" && (
            <p className="text-red-500 text-center border border-red-500 rounded-md p-3">
              {responseMessage}
            </p>
          )}

        {responseMessage === "Úspešene ste sa prihlásili" && (
          <p className="text-green-600 text-center border border-green-600 rounded-md p-3">
            {responseMessage}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Heslo:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 m-0 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Prihlásiť sa
        </button>
      </form>
    </section>
  );
};

export default Login;
