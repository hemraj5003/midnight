import React, { useState } from "react";
import { WalletBuilder } from "@midnight-ntwrk/wallet";
import { getZswapNetworkId } from "@midnight-ntwrk/midnight-js-network-id";

// Configuration for your Midnight Wallet
const config = {
  indexer: "https://indexer.midnight.network",
  indexerWS: "wss://indexer.midnight.network/ws",
  node: "https://node.midnight.network",
  proofServer: "https://proofserver.midnight.network",
};

const App: React.FC = () => {
  const [walletId, setWalletId] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<bigint | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to connect wallet and fetch data
  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    setWalletId(null);
    setTokenBalance(null);

    try {
      // Build the wallet
      const wallet = await WalletBuilder.buildFromSeed(
        config.indexer,
        config.indexerWS,
        config.proofServer,
        config.node,
        "random-seed-or-load-from-secure-storage",
        getZswapNetworkId(),
        "warn"
      );

      wallet.start();

      // Wait for wallet state to sync
      const walletState = await wallet.state().toPromise();
      const walletAddress = walletState.address;
      const balance = walletState.balances.native || 0n;

      setWalletId(walletAddress);
      setTokenBalance(balance);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Wallet Information</h1>
      <button onClick={connectWallet} disabled={loading}>
        {loading ? "Connecting..." : "Connect Wallet"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {walletId && (
        <>
          <p>Wallet ID: {walletId}</p>
          <p>Token Balance: {tokenBalance} TDU</p>
        </>
      )}
    </div>
  );
};

export default App;
