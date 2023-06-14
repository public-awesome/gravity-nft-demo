import BridgeStepper from "@/components/bridge-stepper";
import {useContractAddressContext, useContractNameContext, useNftIdContext} from "@/context/context";
import {Button, Space, TextInput} from "@mantine/core";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {notifications} from "@mantine/notifications";
import {useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import {erc721ABI} from "@/web3/abi";
import {gravityERC721Address} from "@/web3/web3";

export default function SelectNft() {
  const router = useRouter();
  const { address } = useAccount();

  const contractAddressContext = useContractAddressContext();
  const contractNameContext = useContractNameContext();
  const nftIdContext = useNftIdContext();

  const [nftId, setNftId] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [approveTxHash, setApproveTxHash] = useState('');

  const { config } = usePrepareContractWrite({
    address: contractAddressContext.contractAddress,
    abi: erc721ABI as any,
    functionName: 'approve',
    args: [gravityERC721Address, nftId],
  } as any)
  const { data, isLoading, isSuccess, write } = useContractWrite(config as any)

  let txData, txError, txLoading, txSuccess;
  const waitForTxContext = useWaitForTransaction({
    hash: approveTxHash as any || undefined,
  })
  txData = waitForTxContext.data;
  txError = waitForTxContext.isError;
  txLoading = waitForTxContext.isLoading;
  txSuccess = waitForTxContext.isSuccess;

  useEffect(() => {
    if (!contractAddressContext.contractAddress) {
      notifications.show({
        title: 'Something went wrong!',
        message: "Contract address is not set, going back to select collection page",
        color: 'red' as any,
      })

      router.push('/select-collection')
    }

    return () => {}
  })

  if (txSuccess) {
    router.push('/send-nft');
  }

  if (!isLoading && isSuccess && !approveTxHash) {
    console.log("FFS WE DONE", data);
    setApproveTxHash(data!.hash);
  }

  const back = () => {
    router.back();
  }

  const onTextChange = (event: any) => {
    setNftId(event.currentTarget.value);
    setIsDisabled(event.currentTarget.value === '');
  }

  const nextOnClick = async () => {
    console.log("on click", nftId)
    const res = write?.();
    nftIdContext.setNftId(nftId);
    console.log("res", res)
  }

  return (
    <div>
      <BridgeStepper step={1}/>
      <h1>Select NFT</h1>
      <p>Contract address: {contractAddressContext.contractAddress}</p>
      <p>Contract name: {contractNameContext.contractName}</p>
      <p>Wallet address: {address}</p>
      <TextInput placeholder="42" label="NFT ID to bridge" value={nftId} withAsterisk onChange={onTextChange} />
      <Button onClick={back}>Back</Button>
      <Space h="sm"/>
      <Button disabled={isDisabled} onClick={nextOnClick}>Approve NFT</Button>
      {isLoading && <div>Loading</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      {txError && <div>Error</div>}
      {txLoading && <div>Waiting for transaction to finalize</div>}
      {txSuccess && <div>Transaction finalized</div>}
      {txData && <div>Transaction data: {JSON.stringify(txData)}</div>}
    </div>
  );
}