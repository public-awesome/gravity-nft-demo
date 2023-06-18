import BridgeStepper from "@/components/bridge-stepper";
import {
  useContractAddressContext,
  useContractNameContext,
  useNftIdContext,
  useSendTxHashContext
} from "@/context/context";
import {useEffect, useState} from "react";
import {notifications} from "@mantine/notifications";
import {useRouter} from "next/router";
import {useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import {erc721ABI, gravityERC721ABI} from "@/web3/abi";
import {CHAIN_INFO, checkBridgingStatus, flushERC721IbcForwards, gravityERC721Address} from "@/web3/web3";
import {Button, TextInput} from "@mantine/core";


export default function SelectCollection() {
  const router = useRouter();
  const sendTxHashContext = useSendTxHashContext();
  const contractAddressContext = useContractAddressContext();
  const contractNameContext = useContractNameContext();
  const nftIdContext = useNftIdContext();
  const [isDone, setIsDone] = useState(false);

  const { data, isError, isLoading } = useWaitForTransaction({
    hash: sendTxHashContext.sendTxHash as any,
  })

  const backToStartOnClick = () => {
    sendTxHashContext.setSendTxHash('');
    contractAddressContext.setContractAddress('');
    contractNameContext.setContractName('');
    nftIdContext.setNftId('');
    // quick timeout to allow the context to update
    setTimeout(() => {
      router.push('/select-collection');
    }, 100);
  }

  const waitForPendingForward = async (tokenId: string) => {
    console.log("waiting for pending forward", tokenId);
    const status = await checkBridgingStatus(tokenId);
    console.log("status", status);
    if (status.pendingForward) {
      const signer = (window as any).keplr.getOfflineSigner(CHAIN_INFO.chainId);
      const key = await (window as any).keplr.getKey(CHAIN_INFO.chainId);
      flushERC721IbcForwards(key.bech32Address, signer).then(() => {
          setIsDone(true);
      });
    } else {
      setTimeout(() => {
        waitForPendingForward(tokenId);
      }, 5000);
    }
  }

  const waitForBridge = async (tokenId: string) => {
    console.log("waiting for bridge", tokenId);
    const status = await checkBridgingStatus(tokenId);
    console.log("status", status);
    if (status.observed) {
      await waitForPendingForward(tokenId);
    } else {
      setTimeout(() => {
        waitForBridge(tokenId);
      }, 5000);
    }
  }

  useEffect(() => {
    (window as any).keplr.experimentalSuggestChain(CHAIN_INFO).then(() => {
      (window as any).keplr.enable(CHAIN_INFO.chainId).then(() => {
        console.log("keplr", (window as any).keplr);

        waitForBridge(nftIdContext.nftId);
      });
    });
  }, [])
  let step = 3;
  if (!isLoading && !isError) {
    step = 4;
  }

  return (
    <div>
      <BridgeStepper step={step}/>
      <h1>And now we wait!</h1>
      <div>Transaction hash: {sendTxHashContext.sendTxHash}</div>
      <div>Ethereum tx status: {isLoading ? 'Processing tx...' : ''}
        {data ? `Completed` : ''}
        {isError ? 'Transaction error' : ''}</div>
      <div>Bridging status: {isDone ? 'Completed' : 'Waiting...'}</div>
      {isDone && <Button onClick={backToStartOnClick}>Back to the start</Button>}
    </div>
  );
}