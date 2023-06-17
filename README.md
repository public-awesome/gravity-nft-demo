# Gravity NFT UI

The Gravity NFT UI is a fairly simple demo application that allows users to bridge NFTs from 
Ethereum (Sepolia) to the Cosmos ecosystem (not back though) using the gravity bridge hackathon
version that supports ERC721: https://github.com/EmpowerPlastic/Gravity-Bridge/tree/game-of-nfts-stargaze

The UI is not made to be production-ready or to be very easy to use, the point was to have a 
simple UI that showcases the functionality of the bridge in a relatively easy to understand way.

It does (in order of appearance):
- Select collection (by writing in Ethereum NFT contract address)
  - The frontend does some basic checking to see if the contract is an ERC721 contract
- Select NFT (by writing in NFT ID)
- Approve NFT for transfer (Ethereum transaction)

## Development
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.