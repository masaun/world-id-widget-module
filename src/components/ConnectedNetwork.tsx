'use client'
import { useAppKitAccount } from '@reown/appkit/react';
import { useAppKitNetwork } from '@reown/appkit/react';

// @dev - CSS
import '@/lib/world-id-badge-manager/styles/connected-network.css';

export default function ConnectedNetwork() {
  const { isConnected } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();

  if (!isConnected) {
    return <div>Not connected</div>;
  }

  return (
    <div>
      <span className="network-name">
        {caipNetwork
          ? `🌐 Connected to: ${caipNetwork.name}`
          : '🌐 Connected (network unknown)'}
      </span>
    </div>
  );
}
