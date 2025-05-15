"use client";
import AdminInterface from "@/app/components/admin_interface/admin_interface";
import { UseGetMethod } from "@/app/hooks/get_method";
import React, { useEffect } from "react";
import { useState } from "react";

interface User {
  name: string;
  surname: string;
  email: string;
}

export default function UserInterface({}: { params: { username: string } }) {
  const [showAdminContext, setShowAdminContext] = useState<boolean>(false);
  const { dataHook, loadingHook } = UseGetMethod<User>("getuser");

  useEffect(() => {
    if (
      dataHook?.email === "martinhayden3030@gmail.com" &&
      dataHook.name === "Martin" &&
      dataHook.surname === "Hayden"
    ) {
      setShowAdminContext(true);
    } else if (
      dataHook?.email !== "martinhayden3030@gmail.com" &&
      dataHook?.name !== "Martin" &&
      dataHook?.surname !== "Hayden"
    ) {
      setShowAdminContext(false);
    }
  }, [dataHook?.email, dataHook?.name, dataHook?.surname]);
  console.log(showAdminContext);
  return (
    <div>
      {loadingHook && <p>loading...</p>}
      {!loadingHook && showAdminContext ? <AdminInterface /> : <p>User</p>}
    </div>
  );
}
