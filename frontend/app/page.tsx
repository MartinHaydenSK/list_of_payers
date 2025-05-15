"use client";

import Login from "./components/login_registration/login";
import { UseGetMethod } from "./hooks/get_method";

interface User {
  name: string;
  surname: string;
  email: string;
  isPayer: boolean;
  dept: number;
}

export default function Home() {
  const { dataHook } = UseGetMethod<User[]>("getusers");
  const { dataHook: currentUser } = UseGetMethod<User>("getuser");

  return (
    <main>
      <div className="flex flex-col p-10 justify-center items-center h-[90vh] gap-10 text-center">
        <h1 className="text-blue-800 text-3xl font-bold">
          Apka o platbe u Haydena
        </h1>
        <h3 className="text-foreground text-lg max-w-xl">
          Tí ktorí cestujú s Martinom Haydenom tu nájdu poplatky za jazdu.
        </h3>
      </div>

      <div className="min-h-screen p-10">
        <h2 className="text-2xl font-semibold mb-6">Platitelia</h2>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {dataHook &&
            dataHook
              .filter((user) => user.isPayer)
              .map((user, index) => (
                <article
                  key={index}
                  className={`${
                    currentUser?.email === user.email
                      ? "bg-blue-950"
                      : "bg-foreground"
                  } flex flex-col justify-between min-w-[250px] h-[200px] rounded-2xl p-5 text-white shadow-md`}
                >
                  <div>
                    <h2 className="text-4xl text-white">
                      {user.name} {user.surname}
                    </h2>
                  </div>
                  <h3 className="text-blue-300 text-2x mt-4">
                    {(user.dept / 100).toFixed(2)} $
                  </h3>
                </article>
              ))}
        </section>
      </div>
    </main>
  );
}
