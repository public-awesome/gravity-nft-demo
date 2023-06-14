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
import {gravityERC721Address} from "@/web3/web3";
import {Button, TextInput} from "@mantine/core";


export default function SelectCollection() {
  const router = useRouter();
  const sendTxHashContext = useSendTxHashContext();
  const contractAddressContext = useContractAddressContext();
  const contractNameContext = useContractNameContext();
  const nftIdContext = useNftIdContext();

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

  let step = 3;
  if (!isLoading && !isError) {
    step = 4;
  }

  return (
    <div>
      <BridgeStepper step={step}/>
      <h1>And now we wait!</h1>
      <div>Transaction hash: {sendTxHashContext.sendTxHash}</div>
      <div>{isLoading ? 'Processing...' : ''}
        {isError ? 'Transaction error' : ''}</div>
      <div>{data ? `Transaction: ${JSON.stringify(data)}` : ''}</div>
      {!isLoading && !isError && <Button onClick={backToStartOnClick}>Back to the start</Button>}
    </div>
  );
}