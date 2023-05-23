import {createContext, useContext, useState} from "react";

export type IContractAddressContext = {
  contractAddress: string;
  setContractAddress: (contractAddress: string) => void;
}
export type IContractNameContext = {
  contractName: string;
  setContractName: (contractName: string) => void;
}

const ContractAddressContext = createContext<IContractAddressContext | undefined>(undefined);
const ContractNameContext = createContext<IContractNameContext | undefined>(undefined);

export function BridgeWizardProvider({children}: any) {
  const [contractAddress, setContractAddress] = useState('');
  const [contractName, setContractName] = useState('');

  return (
    <ContractAddressContext.Provider value={{contractAddress, setContractAddress}}>
      <ContractNameContext.Provider value={{contractName, setContractName}}>
        {children}
      </ContractNameContext.Provider>
    </ContractAddressContext.Provider>);
}

export function useContractAddressContext() {
  const context = useContext(ContractAddressContext)

  if (!context)
    throw new Error('useContractAddressContext must be used inside a `BridgeWizardProvider`')

  return context
}

export function useContractNameContext() {
  const context = useContext(ContractNameContext)

  if (!context)
    throw new Error('useContractNameContext must be used inside a `BridgeWizardProvider`')

  return context
}