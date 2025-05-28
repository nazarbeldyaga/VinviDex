import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Connector } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect-v2';
import { L1_CHAIN_IDS, L2_CHAIN_IDS, SupportedChainId } from '@/constants/chains';
import { JSON_RPC_FALLBACK_ENDPOINTS } from '@/constants/jsonRpcEndpoints';
import useOption from './useOption';

// Визначаємо типи гаманців
enum Wallet {
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',
}

// Ініціалізуємо MetaMask конектор
const [metaMask] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions }));

// Ініціалізуємо WalletConnect конектор
const WALLET_CONNECT_PROJECT_ID = 'c6c9bacd35afa3eb9e6cccf6d8464395';
const [walletConnect] = initializeConnector<WalletConnect>(
    (actions) =>
        new WalletConnect({
          actions,
          options: {
            rpcMap: Object.entries(JSON_RPC_FALLBACK_ENDPOINTS).reduce((rpcMap, [chainId, rpcUrls]) => ({
              ...rpcMap,
              [chainId]: rpcUrls.slice(0, 1),
            }), {}),
            showQrModal: true,
            projectId: WALLET_CONNECT_PROJECT_ID,
            // Вимагає підтримки основної мережі Ethereum
            chains: [SupportedChainId.MAINNET],
            optionalChains: [...L1_CHAIN_IDS, ...L2_CHAIN_IDS],
            optionalMethods: ['eth_signTypedData', 'eth_signTypedData_v4', 'eth_sign'],
          },
        })
);

export const useProviders = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number | null>(null);

  // Використовуємо опцію для вибору типу гаманця
  const connectorType = useOption('provider', { options: [Wallet.MetaMask, Wallet.WalletConnect] });

  // Функція для підключення до гаманця
  const connectWallet = async () => {
    try {
      let connector: Connector | undefined;

      // Вибираємо конектор в залежності від типу гаманця
      switch (connectorType) {
        case Wallet.MetaMask:
          await metaMask.activate();
          connector = metaMask;
          break;
        case Wallet.WalletConnect:
          await walletConnect.activate();
          connector = walletConnect;
          break;
        default:
          // За замовчуванням використовуємо MetaMask
          if (window.ethereum) {
            await metaMask.activate();
            connector = metaMask;
          } else {
            throw new Error('Не знайдено підтримуваних гаманців');
          }
      }

      if (connector?.provider) {
        // Ініціалізація провайдера
        const web3Provider = new ethers.providers.Web3Provider(connector.provider, 'any');

        // Отримання інформації про акаунт та мережу
        const accounts = await web3Provider.listAccounts();
        const network = await web3Provider.getNetwork();

        setProvider(web3Provider);
        setAccount(accounts[0]);
        setChainId(network.chainId);
        setIsConnected(true);

        // Зберігаємо стан в localStorage для збереження між сесіями
        localStorage.setItem('isLoggedIn', 'true');

        return web3Provider;
      }

      throw new Error('Не вдалося ініціалізувати провайдера');
    } catch (error) {
      console.error('Помилка підключення до гаманця:', error);
      return null;
    }
  };

  // Функція для відключення гаманця
  const disconnectWallet = () => {
    // Деактивуємо конектори
    metaMask.deactivate?.();
    walletConnect.deactivate?.();

    // Скидаємо стан
    setProvider(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

  // Слухачі подій для гаманців
  useEffect(() => {
    // Перевіряємо, чи був користувач підключений раніше
    if (localStorage.getItem('isLoggedIn') === 'true') {
      connectWallet();
    }

    // Обробники подій для MetaMask
    if (window.ethereum) {
      // Обробка зміни акаунтів
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // Користувач відключив гаманець
          disconnectWallet();
        } else {
          // Користувач змінив акаунт
          setAccount(accounts[0]);
        }
      };

      // Обробка зміни мережі
      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
        // Рекомендується перезавантажити сторінку при зміні мережі
        window.location.reload();
      };

      // Обробка відключення
      const handleDisconnect = () => {
        disconnectWallet();
      };

      // Додаємо слухачі подій
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      // Прибираємо слухачі при розмонтуванні компонента
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
          window.ethereum.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, []);

  return {
    provider,
    account,
    isConnected,
    chainId,
    connectWallet,
    disconnectWallet
  };
};