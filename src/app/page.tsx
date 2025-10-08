'use client'
// import { cookieStorage, createStorage, http } from '@wagmi/core'
import { ConnectButton } from "@/components/ConnectButton";
import { InfoList } from "@/components/InfoList";
import { ActionButtonList } from "@/components/ActionButtonList";
import { WorldIdVerification } from "@/components/WorldIdVerification";
import Image from 'next/image';

export default function Home() {

  return (
    <div className={"pages"}>
      <Image src="/reown.svg" alt="Reown" width={150} height={150} priority />
      <h1>World ID Widget Module</h1>

      <ConnectButton />
      <WorldIdVerification 
        onSuccess={(result) => {
          console.log("World ID verification completed:", result);
        }}
        onError={(error) => {
          console.error("World ID verification error:", error);
        }}
      />
      <ActionButtonList />
      <div className="advice">
        <p>
          This projectId only works on localhost. <br/>Go to <a href="https://dashboard.reown.com" target="_blank" className="link-button" rel="Reown Dashboard">Reown Dashboard</a> to get your own.
        </p>
      </div>
      <InfoList />
    </div>
  );
}