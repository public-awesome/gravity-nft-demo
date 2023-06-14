import Web3 from 'web3'
import {erc721ABI, gravityERC721ABI} from "@/web3/abi";
export const web3=new Web3(process.env.NEXT_PUBLIC_PROVIDER!)

export const gravityERC721Address = "0x1Fb9e25AE8eb2ac2a7588B8587e136149AAF49c4";

console.log("provider", process.env.NEXT_PUBLIC_PROVIDER!);

export const getNftContract = (address: string) => {
  return new web3.eth.Contract(
    erc721ABI as any,
    address
  );
};

export const getGravityErc721Contract = (address: string) => {
  return new web3.eth.Contract(
    gravityERC721ABI as any,
    address
  )
}

// https://sepolia.etherscan.io/token/0x1ecb16d92b3ccc4412d71da3bbed6d471704c68a#readContract
// https://usedapp.io/ ?