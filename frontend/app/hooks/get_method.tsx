import { useEffect, useState } from "react";

export const UseGetMethod = <T,>(route: string, trigger?: any) => {
  const [dataHook, setDataHook] = useState<T | undefined>(undefined);
  const [errorHook, setErrorHook] = useState<any>(undefined);
  const [loadingHook, setLoadingHook] = useState<boolean>(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(
    () => {
      const fetchData = async () => {
        setLoadingHook(true);
        try {
          const response = await fetch(`${API_URL}/${route}`, {
            method: "GET",
            credentials: "include",
          });
          const payload = await response.json();

          if (response.ok) {
            setDataHook(payload);
            setErrorHook(undefined);
          } else {
            setErrorHook(payload);
            setDataHook(undefined);
          }
        } catch (err) {
          setErrorHook(err);
          setDataHook(undefined);
        } finally {
          setLoadingHook(false);
        }
      };
      fetchData();
    },
    trigger === undefined ? [] : [trigger]
  );

  return { dataHook, errorHook, loadingHook };
};
