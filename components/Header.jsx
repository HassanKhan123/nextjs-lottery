import React from "react";
import { useMoralis } from "react-moralis";

const Header = () => {
  const { enableWeb3, account } = useMoralis();

  const handleWeb3 = async () => {
    await enableWeb3();
  };

  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}...
          {account.slice(account.length - 4)}
        </div>
      ) : (
        <button onClick={handleWeb3}>Connect</button>
      )}
    </div>
  );
};

export default Header;
