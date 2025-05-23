"use client";
import AdminInterface from "@/app/components/admin_interface/admin_interface";
import { UseGetMethod } from "@/app/hooks/get_method";
import ReportOfPayments from "@/app/components/user_interface/report_of_payments";
import React, { useEffect } from "react";
import { useState } from "react";

interface User {
  name: string;
  surname: string;
  email: string;
}

interface Report {
  date: Date;
  amount: number;
  user: {
    _id: string;
    name: string;
    surname: string;
    email: string;
    isPayer: boolean;
    dept: number;
  };
}

interface Payload {
  user: User;
  reports: Report[];
}
export default function UserInterface() {
  const [showAdminContext, setShowAdminContext] = useState<boolean>(false);
  const { dataHook, loadingHook } = UseGetMethod<Payload>("getuser");

  console.log(dataHook);
  useEffect(() => {
    if (
      dataHook?.user.email === "martinhayden3030@gmail.com" &&
      dataHook.user.name === "Martin" &&
      dataHook.user.surname === "Hayden"
    ) {
      setShowAdminContext(true);
    } else if (
      dataHook?.user.email !== "martinhayden3030@gmail.com" &&
      dataHook?.user.name !== "Martin" &&
      dataHook?.user.surname !== "Hayden"
    ) {
      setShowAdminContext(false);
    }
  }, [dataHook?.user.email, dataHook?.user.name, dataHook?.user.surname]);

  return (
    <div>
      {loadingHook && <p>loading...</p>}
      {!loadingHook && showAdminContext ? (
        <AdminInterface />
      ) : (
        <ReportOfPayments reports={dataHook?.reports} />
      )}
    </div>
  );
}
