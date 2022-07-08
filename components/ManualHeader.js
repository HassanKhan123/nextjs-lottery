import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

const ManualHeader = () => {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (localStorage.getItem("connected")) {
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged(account => {
      console.log("Account changed to ", account);
      if (!account) {
        localStorage.removeItem("connected");
        deactivateWeb3();
      }
    });
  }, []);

  const handleWeb3 = async () => {
    await enableWeb3();
    localStorage.setItem("connected", "injected");
  };

  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}...
          {account.slice(account.length - 4)}
        </div>
      ) : (
        <button onClick={handleWeb3} disabled={isWeb3EnableLoading}>
          Connect
        </button>
      )}
    </div>
  );
};

export default ManualHeader;
