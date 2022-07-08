import React, { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

import { abi, contractAddress } from "../constants";

const LotteryEntrance = () => {
  const [entranceFees, setEntranceFees] = useState(0);
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;

  const dispatch = useNotification();

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      (async () => {
        const contractEntranceFees = await getEntranceFee({
          onError: error => console.log(error),
        });
        setEntranceFees(contractEntranceFees);
      })();
    }
  }, [isWeb3Enabled]);

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFees,
  });

  const handleRaffle = async () => {
    await enterRaffle({
      onSuccess: handleSuccess,
      onError: error => console.log(error),
    });
  };

  const handleSuccess = async tx => {
    await tx.wait(1);
    handleNewNotification(tx);
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <div>
      LotteryEntrance
      {raffleAddress ? (
        <div>
          <button onClick={handleRaffle}>Enter Raffle</button>
          Entrance Fees: {ethers.utils.formatUnits(entranceFees, "ether")} ETH
        </div>
      ) : (
        <div>No Raffle Address Detected</div>
      )}
    </div>
  );
};

export default LotteryEntrance;
