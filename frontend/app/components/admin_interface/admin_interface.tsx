import { UseGetMethod } from "@/app/hooks/get_method";
import React, { useState } from "react";
import ListOfUsers from "./list_of_users";
import PayingSystem from "./paying_system";

interface User {
  name: string;
  surname: string;
  email: string;
  isPayer: boolean;
  dept: number;
}

export default function AdminInterface() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { dataHook } = UseGetMethod<User[]>("getusers");

  const [toggle, setToggle] = useState<string>("Všetci prihlásený");
  const filterUsers = () => {
    if (toggle === "Všetci prihlásený") {
      setToggle("Platiteľia");
    } else {
      setToggle("Všetci prihlásený");
    }
  };
  return (
    <main>
      <button className="m-5 rounded-none" onClick={() => filterUsers()}>
        {toggle}
      </button>
      {toggle === "Platiteľia" && <ListOfUsers data={dataHook} />}
      {toggle === "Všetci prihlásený" && <PayingSystem />}
    </main>
  );
}
