import React, { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

import { abi, contractAddress } from "../constants";

const LotteryEntrance = () => {
  const [entranceFees, setEntranceFees] = useState(0);
  const [numPlayers, setNumPlayers] = useState(0);
  const [recentWinner, setRecentWinner] = useState("");

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

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const {
    runContractFunction: enterRaffle,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFees,
  });

  const updateUI = async () => {
    const contractEntranceFees = await getEntranceFee({
      onError: error => console.log(error),
    });
    const numberOfPlayers = await getNumberOfPlayers({
      onError: error => console.log(error),
    });
    const recentWinner = await getRecentWinner({
      onError: error => console.log(error),
    });
    setEntranceFees(contractEntranceFees.toString());
    setNumPlayers(numberOfPlayers.toString());
    setRecentWinner(recentWinner.toString());
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      (async () => {
        await updateUI();
      })();
    }
  }, [isWeb3Enabled]);

  const handleRaffle = async () => {
    await enterRaffle({
      onSuccess: handleSuccess,
      onError: error => console.log(error),
    });
  };

  const handleSuccess = async tx => {
    await tx.wait(1);
    handleNewNotification(tx);
    await updateUI();
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
    <div className="p-5">
      <h1 className="py-4 px-4 font-bold text-3xl">Lottery</h1>
      {raffleAddress ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            disabled={isLoading || isFetching}
            onClick={handleRaffle}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              "Enter Raffle"
            )}
          </button>
          Entrance Fees: {ethers.utils.formatUnits(entranceFees, "ether")} ETH
          <div>Number of Players: {numPlayers}</div>
          <div>Recent Winner: {recentWinner}</div>
        </div>
      ) : (
        <div>No Raffle Address Detected</div>
      )}
    </div>
  );
};

export default LotteryEntrance;
