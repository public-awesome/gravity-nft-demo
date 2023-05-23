import BridgeStepper from "@/components/bridge-stepper";
import {useContractAddressContext, useContractNameContext} from "@/context/context";
import {Button} from "@mantine/core";
import {useRouter} from "next/router";


export default function SelectNft() {
  const contractAddressContext = useContractAddressContext();
  const contractNameContext = useContractNameContext();

  const router = useRouter();

  const back = () => {
    router.back();
  }

  return (
    <div>
      <BridgeStepper step={1}/>
      <h1>Select NFT</h1>
      <p>Contract address: {contractAddressContext.contractAddress}</p>
      <p>Contract name: {contractNameContext.contractName}</p>
      <Button onClick={back}>Back</Button>
    </div>
  );
}