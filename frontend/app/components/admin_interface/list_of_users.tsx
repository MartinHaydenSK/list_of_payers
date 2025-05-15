import React, { useEffect } from "react";
import { useState } from "react";
interface User {
  name: string;
  surname: string;
  email: string;
  isPayer: boolean;
  dept: number;
}

export default function ListOfUsers({ data }: { data: User[] | undefined }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [ListOfUsers, setListOfUsers] = useState<User[] | undefined>(data);
  const addPayer = async (email: string, index: number) => {
    const response = await fetch(`${API_URL}/addPayer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (data) {
      setListOfUsers((prev) =>
        prev?.map((user, i) =>
          i === index ? { ...user, isPayer: true } : user
        )
      );
    }
  };
  useEffect(() => {
    if (data) {
      setListOfUsers(data);
    }
  }, [data]);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 items-start justify-center m-4">
      {ListOfUsers &&
        ListOfUsers.map((user, index) => (
          <article
            key={index}
            className="bg-foreground flex flex-col items-center rounded-2xl p-4"
          >
            <h3>
              {user.name} {user.surname}
            </h3>
            <p className="text-white">{user.email}</p>
            <button
              className="m-5 w-full"
              disabled={user?.isPayer}
              onClick={() => addPayer(user.email, index)}
            >
              {user?.isPayer ? <p>Je platiteľ</p> : <p>Nie je platiteľ</p>}
            </button>
          </article>
        ))}
    </section>
  );
}
