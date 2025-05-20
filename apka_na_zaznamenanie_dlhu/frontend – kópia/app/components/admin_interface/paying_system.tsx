import React, { useState } from "react";
import { UseGetMethod } from "@/app/hooks/get_method";
interface User {
  name: string;
  surname: string;
  email: string;
  isPayer: boolean;
  dept: number;
  _id: string;
}

export default function PayingSystem() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [response, setResponse] = useState<string | undefined>(undefined);
  const [operation, setOperation] = useState<boolean>(true);
  const [customAmount, setCustomAmount] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [openingIndex, setOpeningIndex] = useState<number | undefined>(
    undefined
  );
  const [showInput, setShowHiddenInput] = useState<boolean>(false);
  const addToDept = async (
    id: string,
    amount: number,
    userCurrentAmount: number,
    index: number
  ) => {
    setOpeningIndex(index);
    const NewAmount = operation
      ? amount + userCurrentAmount
      : userCurrentAmount - amount;

    try {
      const response = await fetch(`${API_URL}/addToDept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, NewAmount }),
      });

      const data = await response.json();

      if (data) {
        setRefreshTrigger((prev) => prev + 1);
        setResponse(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openHiddenPart = (index: number) => {
    setResponse(undefined);
    setOpeningIndex(index);
    setShowHiddenInput(true);
  };
  const addToCustomDept = async (id: string, userCurrentAmount: number) => {
    const NewAmount = operation
      ? Number(customAmount) + userCurrentAmount
      : userCurrentAmount - Number(customAmount);

    try {
      const response = await fetch(`${API_URL}/addToDept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, NewAmount }),
      });

      const data = await response.json();

      if (data) {
        setRefreshTrigger((prev) => prev + 1);
        setResponse(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const { dataHook } = UseGetMethod<User[]>("getusers", refreshTrigger);

  const changeOperation = () => {
    if (operation) {
      setOperation(false);
    } else {
      setOperation(true);
    }
  };
  return (
    <section>
      <div className="flex justify-start ml-4 items-center pr-15 md:gap-0">
        <button
          className=" rounded-full  bg-blue-700 w-[80px] ml-0 h-[80px] text-white  md:m-0"
          onClick={() => changeOperation()}
        >
          {operation ? (
            <p className="text-white">+</p>
          ) : (
            <p className="text-white">-</p>
          )}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 gap-8">
        {dataHook
          ?.filter((user) => user.isPayer === true)
          .map((user, index) => (
            <article key={index} className="bg-foreground p-4 rounded-xl">
              <article className="flex flex-col justify-center items-center gap-2">
                <h3 className="text-white text-center">
                  {user.name} {user.surname}
                </h3>
                <h3 className="text-white">{(user.dept / 100).toFixed(2)} $</h3>
                {response && index === openingIndex && (
                  <p className="text-white">{response}</p>
                )}
              </article>

              <article className="flex flex-col items-center gap-2 mt-4">
                <button
                  className="min-w-0 w-fit px-8 py-2 bg-blue-500 text-white rounded"
                  onClick={() => addToDept(user._id, 70, user.dept, index)}
                >
                  {operation ? "Plus" : "Minus"} 70 cents
                </button>
                <button
                  className="min-w-0 w-fit px-8 py-2 bg-blue-500 text-white rounded"
                  onClick={() => addToDept(user._id, 75, user.dept, index)}
                >
                  {operation ? "Plus" : "Minus"} 75 cents
                </button>
                {index !== openingIndex && (
                  <button
                    className="min-w-0 w-fit px-8 py-2 text-white underline"
                    onClick={() => openHiddenPart(index)}
                  >
                    Zadať custom hodnotu
                  </button>
                )}
                {showInput && index === openingIndex && (
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <label className="text-white">
                      {operation ? "Plus" : "Minus"}
                    </label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(Number(e.target.value))}
                      className="p-1 rounded text-black"
                    />
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded"
                      onClick={() => addToCustomDept(user._id, user.dept)}
                    >
                      Poslať novú hodnotu
                    </button>
                  </div>
                )}
              </article>
            </article>
          ))}
      </div>
    </section>
  );
}
