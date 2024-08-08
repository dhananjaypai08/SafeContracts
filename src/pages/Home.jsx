import React, { useState, useEffect } from 'react';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { useWeb3ModalProvider, useWeb3ModalAccount, useDisconnect, useWeb3ModalTheme, useWeb3Modal } from '@web3modal/ethers/react';
import { BrowserProvider, Contract } from 'ethers';
import contractData from '../contracts/Contract.json';
import AddContract from '../components/AddContract';

// Web3Modal configuration
const projectId = 'a7a2557c75d9558a9c932d5f99559799';

const testnet1 = {
  chainId: 2442,
  name: 'Polygon zkEVM Cardona Testnet',
  currency: 'ETH',
  explorerUrl: 'https://cardona-zkevm.polygonscan.com/',
  rpcUrl: 'https://polygon-zkevm-cardona.blockpi.network/v1/rpc/public'
};

const testnet = {
  chainId: 97,
  name: 'BNB Chain Testnet',
  currency: 'tBNB',
  explorerUrl: 'https://testnet.bscscan.com',
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
}

const metadata = {
  name: 'SafeContracts',
  description: 'Decentralized Smart Contract Reliability Checker',
  url: 'https://SafeContracts.com',
  icons: ['https://example.com/icon.png']
};

const ethersConfig = defaultConfig({
  metadata,
  defaultChainId: 11155111,
});

createWeb3Modal({
  ethersConfig,
  chains: [testnet],
  projectId,
  enableAnalytics: true,
  themeMode: 'dark'
});

function Home() {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const [contract, setContract] = useState(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [contractInfo, setContractInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [AddContractFlag, setAddContractFlag] = useState(false);
  const [flaggedState, setFlaggedState] = useState(false);
  const [msgButtonAddContract, setMsgButtonAddContract] = useState("Add Contract");

  useEffect(() => {
    if (isConnected && walletProvider) {
      initializeContract();
    }
  }, [isConnected, walletProvider]);

  async function initializeContract() {
    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();
    const newContract = new Contract(contractData.address, contractData.abi, signer);
    setContract(newContract);
  }

  async function searchContract() {
    if (!contract) return;
    setLoading(true);
    try {
      const result = await contract.searchContract(searchAddress);
      setContractInfo({
        owner: result[0],
        aiStatus: result[1],
        flagCount: result[2].toString()
      });
      console.log(result);
    } catch (error) {
      console.error('Error searching contract:', error);
      setContractInfo(null);
    }
    setLoading(false);
  }

  async function flagContract() {
    if (!contract || !searchAddress) return;
    setLoading(true);
    try {
      const tx = await contract.flag(searchAddress);
      await tx.wait();
      await searchContract();
      setFlaggedState(true);
    } catch (error) {
      console.error('Error flagging contract:', error);
    }
    setLoading(false);
  }

  async function callAddContractFlag(status){
    if(msgButtonAddContract == "Exit"){
      setAddContractFlag(false);
      setMsgButtonAddContract("Add Contract");
    } else{
      setAddContractFlag(status);
      setMsgButtonAddContract("Exit");
    }
    
  }


  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">SafeContracts</h1>
            <w3m-button />
          {isConnected && (
            <button onClick={disconnect} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
              Disconnect
            </button>
          ) 
          }
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Smart Contract Reliability Checker</h2>
          <p className="text-gray-300 mb-6">
            Check the reliability of any smart contract by entering its address below. Our AI-powered system and community feedback will help you determine if a contract is safe to interact with.
          </p>
          <div className="flex gap-4">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Enter contract address"
              className="flex-grow px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={searchContract}
              disabled={!isConnected || loading}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          <button
              onClick={() => callAddContractFlag(true)}
              className="mt-6 bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded disabled:opacity-50"
            >
              {msgButtonAddContract}
          </button>
          {AddContractFlag &&
          <AddContract walletProvider={walletProvider}/>
          }
        </section>

        {contractInfo && (
          <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Contract Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Owner:</p>
                <p className="font-mono">{contractInfo.owner}</p>
              </div>
              <div>
                <p className="text-gray-400">AI Status:</p>
                <p className={`font-bold ${contractInfo.aiStatus === 'Safe' ? 'text-green-500' : 'text-red-500'}`}>
                  {contractInfo.aiStatus}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Community Flags:</p>
                <p>{contractInfo.flagCount}</p>
              </div>
            </div>
            {flaggedState && <p className="text-black-400">Contract Flagged</p>}
            <button
              onClick={flagContract}
              disabled={loading}
              className="mt-6 bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Flagging...' : 'Flag as Unsafe'}
            </button>
            <button
              onClick={() => {open({view: 'OnRampProviders'})}}
              disabled={loading}
              className="mt-6 bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded disabled:opacity-50"
            >
              Stake Native Crypto
            </button>
          </section>
        )}
      </main>

      <footer className="bg-gray-800 mt-12 py-6">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2024 SafeContracts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;