import {createContext, useContext, useState} from "react";

export type IContractAddressContext = {
  contractAddress: string;
  setContractAddress: (contractAddress: string) => void;
}
export type IContractNameContext = {
  contractName: string;
  setContractName: (contractName: string) => void;
}

export type INftIdContext = {
  nftId: string;
  setNftId: (nftId: string) => void;
}

export type ISendTxHash = {
  sendTxHash: string;
  setSendTxHash: (sendTxHash: string) => void;
}

const ContractAddressContext = createContext<IContractAddressContext | undefined>(undefined);
const ContractNameContext = createContext<IContractNameContext | undefined>(undefined);
const NftIdContext = createContext<INftIdContext | undefined>(undefined);
const SendTxHashContext = createContext<ISendTxHash | undefined>(undefined);

export function BridgeWizardProvider({children}: any) {
  const [contractAddress, setContractAddress] = useState('');
  const [contractName, setContractName] = useState('');
  const [nftId, setNftId] = useState('');
  const [sendTxHash, setSendTxHash] = useState('');

  return (
    <ContractAddressContext.Provider value={{contractAddress, setContractAddress}}>
      <ContractNameContext.Provider value={{contractName, setContractName}}>
        <NftIdContext.Provider value={{nftId, setNftId}}>
          <SendTxHashContext.Provider value={{sendTxHash, setSendTxHash}}>
            {children}
          </SendTxHashContext.Provider>
        </NftIdContext.Provider>
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

export function useNftIdContext() {
  const context = useContext(NftIdContext)

  if (!context)
    throw new Error('useNftIdContext must be used inside a `BridgeWizardProvider`')

  return context
}

export function useSendTxHashContext() {
  const context = useContext(SendTxHashContext)

  if (!context)
    throw new Error('useSendTxHashContext must be used inside a `BridgeWizardProvider`')

  return context
}