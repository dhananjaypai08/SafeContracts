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
  auth: {
    email: true, // default to true
    socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook', 'farcaster'],
    showWallets: true, // default to true
    walletFeatures: true // default to true
  }
});

createWeb3Modal({
  ethersConfig,
  chains: [testnet],
  projectId,
  enableAnalytics: true,
  themeMode: 'light'
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
    <div className="min-h-screen bg-gradient-to-b from-gray-300 to-gray-400 text-gray-800">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">SafeContracts</h1>
          <a href="/chat" className="text-black-600 font-bold hover:text-blue-600 transition">ChatWitAI</a>
          {isConnected && <button onClick={() => disconnect()} className="bg-black text-white px-6 py-2 rounded-r hover:bg-gray-800 transition disabled:opacity-50">Disconnect</button>}
          <nav className="space-x-4">
            
            {/* 
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">Services</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">Contact</a> */}
            <w3m-button />
          </nav>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4">
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4 text-blue-600">Smart Contract Reliability Checker</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Ensure the safety of your interactions. Our AI-powered system and community feedback help you determine if a contract is reliable.
          </p>
          <div className="flex gap-4 justify-center">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Enter contract address"
              className="flex-grow max-w-md px-4 py-2 bg-white border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={searchContract}
              disabled={!isConnected || loading}
              className="bg-black text-white px-6 py-2 rounded-r hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          <button
            onClick={() => callAddContractFlag(true)}
            className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            {msgButtonAddContract}
          </button>
          {AddContractFlag && <AddContract walletProvider={walletProvider} />}
        </section>

        {contractInfo && (
          <section className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">Contract Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-black-600">Owner:</p>
                <p className="font-mono">{contractInfo.owner}</p>
              </div>
              <div>
                <p className="text-black-600">AI Status:</p>
                <p className={`font-bold ${contractInfo.aiStatus === 'Safe' ? 'text-green-600' : 'text-red-600'}`}>
                  {contractInfo.aiStatus}
                </p>
              </div>
              <div>
                <p className="text-black-600">Community Flags(No. of ppl that marked this contract as Unsafe):</p>
                <p>{contractInfo.flagCount}</p>
              </div>
            </div>
            {flaggedState && <p className="text-red-600 mt-4">Contract Flagged</p>}
            <div className="mt-6 space-x-4">
              <button
                onClick={flagContract}
                disabled={loading}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? 'Flagging...' : 'Flag as Unsafe'}
              </button>
              <button
                onClick={() => {open({view: 'OnRampProviders'})}}
                disabled={loading}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
              >
                Stake Native Crypto
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-white mt-12 py-6 shadow-inner">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; 2024 SafeContracts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;