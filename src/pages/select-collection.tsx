import BridgeStepper from "@/components/bridge-stepper";
import {Button, Space, TextInput} from "@mantine/core";
import {useState} from "react";
import {getNftContract} from "@/web3/web3";
import {notifications} from "@mantine/notifications";
import {useContractAddressContext, useContractNameContext} from "@/context/context";
import {useRouter} from "next/router";

export default function SelectCollection() {
  const router = useRouter()

  const contractAddressContext = useContractAddressContext();
  const contractNameContext = useContractNameContext();

  const [isDisabled, setIsDisabled] = useState(!contractAddressContext.contractAddress);
  const [contractAddress, setContractAddress] = useState(contractAddressContext.contractAddress);

  const onTextChange = (event: any) => {
    setContractAddress(event.currentTarget.value);
    setIsDisabled(event.currentTarget.value === '');
  }

  const nextOnClick = async () => {
    try {
      const contract = getNftContract(contractAddress);
      const name = await contract.methods.name().call()

      contractAddressContext.setContractAddress(contractAddress);
      contractNameContext.setContractName(name);

      await router.push('/select-nft');
    } catch (error: any) {
      notifications.show({
        title: 'Something went wrong!',
        message: error.message,
        color: 'red' as any,
      })
    }
  }

  return (
    <div>
      <BridgeStepper step={0}/>
      <h1>Select Collection</h1>
      <TextInput placeholder="0x123..." label="Ethereum contract address" value={contractAddress} withAsterisk onChange={onTextChange} />
      <Space h="sm"/>
      <Button disabled={isDisabled} onClick={nextOnClick}>Next</Button>
    </div>
  );
}