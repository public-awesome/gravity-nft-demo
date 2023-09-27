import { AppShell, Container, Header, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BridgeWizardProvider } from "@/context/context";
import { WagmiConfig, createClient, sepolia } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

declare const sepolia_override: {
  readonly id: 11155111;
  readonly network: "sepolia";
  readonly name: "Sepolia";
  readonly nativeCurrency: {
    readonly name: "Sepolia Ether";
    readonly symbol: "SEP";
    readonly decimals: 18;
  };
  readonly rpcUrls: {
    readonly alchemy: {
      readonly http: readonly ["https://eth-sepolia.g.alchemy.com/v2"];
      readonly webSocket: readonly ["wss://eth-sepolia.g.alchemy.com/v2"];
    };
    readonly infura: {
      readonly http: readonly ["https://sepolia.infura.io/v3"];
      readonly webSocket: readonly ["wss://sepolia.infura.io/ws/v3"];
    };
    readonly default: {
      readonly http: readonly ["https://rpc-sepolia.rockx.com"];
    };
    readonly public: {
      readonly http: readonly ["https://rpc-sepolia.rockx.com"];
    };
  };
  readonly blockExplorers: {
    readonly etherscan: {
      readonly name: "Etherscan";
      readonly url: "https://sepolia.etherscan.io";
    };
    readonly default: {
      readonly name: "Etherscan";
      readonly url: "https://sepolia.etherscan.io";
    };
  };
  readonly contracts: {
    readonly multicall3: {
      readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
      readonly blockCreated: 6507670;
    };
  };
  readonly testnet: true;
};

export default function MyApp({ Component, pageProps }: any) {
  const client = createClient(
    getDefaultClient({
      appName: "Gravity NFT UI",
      walletConnectProjectId: "0b30e89125abdfb8bb0b829e5f0b9a2e",
      chains: [sepolia_override]
    })
  );

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS
      theme={{
        // Override any other properties from default theme
        colorScheme: 'dark',
        fontFamily: 'Open Sans, sans serif',
        spacing: { xs: '1rem', sm: '1.2rem', md: '1.8rem', lg: '2.2rem', xl: '2.8rem' },
      }}
    >
      <Notifications />
      <AppShell
        padding="md"
        header={<Header height={60} p="xs">{/* Header content */}</Header>}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        <Container>
          <WagmiConfig client={client as any}>
            <ConnectKitProvider theme="auto" mode="dark">
              <BridgeWizardProvider>
                <Component {...pageProps} />
              </BridgeWizardProvider>
            </ConnectKitProvider>
          </WagmiConfig>
        </Container>

      </AppShell>

    </MantineProvider>
  );
}