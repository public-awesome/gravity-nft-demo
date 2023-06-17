import Web3 from 'web3'
import {erc721ABI, gravityERC721ABI} from "@/web3/abi";
import {ChainInfo} from "@keplr-wallet/types";
import { gravity, getSigningGravityClient } from "./gravityjs"
import Long from "long";
import {MsgExecuteIbcAutoForwards, MsgSendERC721ToCosmosClaim} from "@/web3/gravityjs/codegen/gravity/v1/msgs";
import {Attestation} from "@/web3/gravityjs/codegen/gravity/v1/attestation";
import {OfflineSigner} from "@cosmjs/proto-signing";
import {calculateFee, GasPrice} from "@cosmjs/stargate";

export const CHAIN_INFO: ChainInfo = {
  chainId: "gravitygaze-3",
  chainName: "Gravitygaze testnet",
  rpc: "ws://51.159.144.49:26657",
  rest: "http://51.159.144.49:1317",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "gravity",
    bech32PrefixAccPub: "gravity" + "pub",
    bech32PrefixValAddr: "gravity" + "valoper",
    bech32PrefixValPub: "gravity" + "valoperpub",
    bech32PrefixConsAddr: "gravity" + "valcons",
    bech32PrefixConsPub: "gravity" + "valconspub",
  },
  currencies: [
    {
      coinDenom: "GRAV",
      coinMinimalDenom: "ugraviton",
      coinDecimals: 6,
      coinGeckoId: "grav",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "GRAV",
      coinMinimalDenom: "ugraviton",
      coinDecimals: 6,
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: "GRAV",
    coinMinimalDenom: "ugraviton",
    coinDecimals: 6,
  },
};


export const web3=new Web3(process.env.NEXT_PUBLIC_PROVIDER!)
export const gravityERC721Address = "0x4f2Ff6F09467B176A9d58ccb8E29E81057Ad5FD4";

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

export type BridgeStatus = {
  attestationOnChain: boolean,
  observed: boolean,
  pendingForward: boolean,
}

export const checkBridgingStatus = async (tokenId: string): Promise<BridgeStatus> => {
  const queryClient = await gravity.ClientFactory.createRPCQueryClient({rpcEndpoint: CHAIN_INFO.rpc})

  const erc721IbcAutoForwardsResponse = await queryClient.gravity.v1.getPendingERC721IbcAutoForwards({
    limit: Long.fromNumber(100),
  });
  for (const forward of erc721IbcAutoForwardsResponse.pendingErc721IbcAutoForwards) {
    if (forward.tokenId === tokenId) {
      return {
        attestationOnChain: true,
        observed: true,
        pendingForward: true,
      }
    }
  }
  console.log("erc721IbcAutoForwardsResponse", erc721IbcAutoForwardsResponse);

  const nonceResponse = await queryClient.gravity.v1.getLastObservedERC721EthNonce({});
  console.log("nonceResponse", nonceResponse);

  const attestationsResponse = await queryClient.gravity.v1.getERC721Attestations({
    limit: Long.fromNumber(100),
    orderBy: "",
    claimType: "/gravity.v1.MsgSendERC721ToCosmosClaim",
    nonce: nonceResponse.nonce,
    height: Long.fromNumber(0),
  })

  let tokenAttestation: Attestation | undefined
  let msgSendERC721ToCosmosClaim: MsgSendERC721ToCosmosClaim
  for (const attestation of attestationsResponse.attestations) {
    const claim = MsgSendERC721ToCosmosClaim.decode(attestation.claim?.value!);
    if (claim.tokenId === tokenId) {
      tokenAttestation = attestation
      msgSendERC721ToCosmosClaim = claim
      break
    }
  }

  return {
    attestationOnChain: (typeof tokenAttestation !== "undefined"),
    observed: (typeof tokenAttestation !== "undefined") ? tokenAttestation.observed : false,
    pendingForward: false,
  }
}

export const flushERC721IbcForwards = async (signerAddress: string, signer: OfflineSigner) => {
  const client = await getSigningGravityClient({
    rpcEndpoint: CHAIN_INFO.rpc,
    signer
  });

  const msg = MsgExecuteIbcAutoForwards.fromPartial({
    forwardsToClear: Long.fromNumber(10),
    executor: signerAddress
  })
  const fullMsg = gravity.v1.MessageComposer.fromPartial.executeIbcAutoForwards(msg)

  return client.signAndBroadcast(signerAddress, [fullMsg], calculateFee(200000, GasPrice.fromString('0.025ugraviton')),
  );
}

// https://sepolia.etherscan.io/token/0x1ecb16d92b3ccc4412d71da3bbed6d471704c68a#readContract
// https://usedapp.io/ ?