import {Button, Space} from "@mantine/core";
import {ConnectKitButton, } from "connectkit";
import {useRouter} from "next/router";


export default function Home() {
  const router = useRouter();

  const lessGooooo = async () => {
    await router.push('/select-collection');
  }

  return (
    <div>
      <h1>Home sweet home</h1>
      <p>Let's get started!</p>
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, hide, address }) => {
          return (
            <>
              <Button onClick={show}>{isConnected ? address : "Connect wallet"}</Button>
              <Space h="sm"/>
              <Button disabled={!address} onClick={lessGooooo}>Bridge an NFT</Button>
            </>
          );
        }}
      </ConnectKitButton.Custom>
    </div>
  );
}