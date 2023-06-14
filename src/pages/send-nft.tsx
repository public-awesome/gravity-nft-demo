import BridgeStepper from "@/components/bridge-stepper";
import {useContractAddressContext, useNftIdContext, useSendTxHashContext} from "@/context/context";
import {useEffect, useState} from "react";
import {notifications} from "@mantine/notifications";
import {useRouter} from "next/router";
import {useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import {erc721ABI, gravityERC721ABI} from "@/web3/abi";
import {gravityERC721Address} from "@/web3/web3";
import {Button, TextInput} from "@mantine/core";


export default function SelectCollection() {
  const router = useRouter();
  const contractAddressContext = useContractAddressContext();
  const nftIdContext = useNftIdContext();
  const sendTxHashContext = useSendTxHashContext();
  const { address } = useAccount();

  const [destinationAddress, setDestinationAddress] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  const { config } = usePrepareContractWrite({
    address: gravityERC721Address,
    abi: gravityERC721ABI as any,
    functionName: 'sendERC721ToCosmos',
    args: [contractAddressContext.contractAddress, destinationAddress, nftIdContext.nftId],
  } as any)
  const { data, isLoading, isSuccess, write } = useContractWrite(config as any)

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

  if (sendTxHashContext.sendTxHash) {
    router.push('/wait');
  }

  if (!isLoading && isSuccess) {
    console.log("FFS WE DONE", data);
    sendTxHashContext.setSendTxHash(data!.hash);
  }

  const onTextChange = (event: any) => {
    setDestinationAddress(event.currentTarget.value);
    setIsDisabled(event.currentTarget.value === '');
  }

  const sendOnClick = async () => {
    console.log("on click", destinationAddress)
    const res = write?.();
    console.log("res", res);
  }

  return (
    <div>
      <BridgeStepper step={2}/>
      <h1>Send NFT</h1>
      <TextInput placeholder="stars123..." label="Cosmos destination address (stars, omniflix)" value={destinationAddress} withAsterisk onChange={onTextChange} />
      <Button disabled={isDisabled} onClick={sendOnClick}>Send NFT</Button>
      {isLoading && <div>Loading</div>}
    </div>
  );
}