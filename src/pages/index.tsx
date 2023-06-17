import {Button, Space} from "@mantine/core";
import {ConnectKitButton,} from "connectkit";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {CHAIN_INFO, flushERC721IbcForwards, getPendingERC721IbcAutoForwards} from "@/web3/web3";


export default function Home() {
  const router = useRouter();
  const [hasPendingAutoForwards, setHasPendingAutoForwards] = useState(false);

  useEffect(() => {
    (window as any).keplr.experimentalSuggestChain(CHAIN_INFO).then(() => {
      (window as any).keplr.enable(CHAIN_INFO.chainId).then(() => {
        getPendingERC721IbcAutoForwards().then((pendingAutoForwards) => {
          if (pendingAutoForwards.length > 0) {
            setHasPendingAutoForwards(true);
          }
        }).catch((error) => {
          alert(error);
        });
      })
    });
  }, []);

  const lessGooooo = async () => {
    await router.push('/select-collection');
  }

  const onFlushClick = async () => {
    const signer = (window as any).keplr.getOfflineSigner(CHAIN_INFO.chainId);
    (window as any).keplr.getKey(CHAIN_INFO.chainId).then((key) => {
      return flushERC721IbcForwards(key.bech32Address, signer);
    }).then(() => {
      setHasPendingAutoForwards(false);
      alert("Flush done!");
    }).catch((error) => {
      alert(error);
    });

  }

  return (
    <div>
      <h1>Gravity NFT Demo UI</h1>
      <p>Let's get started!</p>
      <ConnectKitButton.Custom>
        {({isConnected, isConnecting, show, hide, address}) => {
          return (
            <>
              <Button onClick={show}>{isConnected ? "Wallet connected: " + address : "Connect wallet"}</Button>
              <Space h="sm"/>
              <Button disabled={!address} onClick={lessGooooo}>Bridge an NFT</Button>
              {hasPendingAutoForwards && (
                <>
                  <Space h="sm"/>
                  <Button onClick={onFlushClick}>Flush pending bridge transactions</Button>
                </>
              )
              }
            </>
          );
        }}
      </ConnectKitButton.Custom>
    </div>
  );
}