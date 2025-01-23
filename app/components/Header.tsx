"use client";
import React from "react";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
const Header = () => {
  const wallet = useWallet();
  console.log(wallet.address, wallet.connected);
  return (
    <div className="w-[75dvw] grid grid-cols-1 md:flex justify-between">

      <p style={{
        fontFamily:"cursive"
      }} className="text-lg">Atoma's Coin Sage</p>
      <div className="w-10 border md:block  hidden ">
        <ConnectButton className="bg-green-100 text-pink-400" label="Connect Wallet"  />
      </div>
    </div>
  );
};

export default Header;
