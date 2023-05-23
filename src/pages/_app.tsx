import {AppShell, Container, Header, MantineProvider} from "@mantine/core";
import {Notifications} from "@mantine/notifications";
import {BridgeWizardProvider} from "@/context/context";
import {WagmiConfig, createClient, sepolia} from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

export default function MyApp({ Component, pageProps }: any) {
  const client = createClient(
    getDefaultClient({
      appName: "Gravity NFT UI",
      walletConnectProjectId: "0b30e89125abdfb8bb0b829e5f0b9a2e",
      chains: [sepolia]
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