import React, { useState } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { BrowserProvider, Contract } from 'ethers';
import contractData from '../contracts/Contract.json';
import { create } from "ipfs-http-client";

const AddContract = ({ walletProvider }) => {
  const projectId = '2WCbZ8YpmuPxUtM6PzbFOfY5k4B';
    const projectSecretKey = 'c8b676d8bfe769b19d88d8c77a9bd1e2';
    const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);
    const ipfs_client = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      apiPath: "/api/v0",
      headers:{
        authorization: authorization
      },
    });
    const BASE_IPFS_URL = "https://ipfs.infura.io/ipfs/";

  const { address } = useWeb3ModalAccount();
  const [contractAddress, setContractAddress] = useState('');
  const [contractName, setContractName] = useState('');
  const [contractDescription, setContractDescription] = useState('');
  const [contractCode, setContractCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  

  const addContractToBlockchain = async (cid) => {
    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();
    const contract = new Contract(contractData.address, contractData.abi, provider);
    const contractwithsigner = contract.connect(signer);
    console.log(provider, signer, contract, contractwithsigner, address, contractAddress, contractData.address);
    
    try {
      const tx = await contractwithsigner.addContract(address, contractAddress, cid, 'Safe');
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);
      return receipt;
    } catch (error) {
      console.error('Error in addContractToBlockchain:', error);
      throw error;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Uploading to IPFS...');
  
    try {
      // const sc = await ipfs_client.add(contractCode);
      // const codeURI = BASE_IPFS_URL+sc.hash;
      const data = JSON.stringify({
        name: contractName,
        description: contractDescription,
        image: "encrypted",
      });
  
      const res = await ipfs_client.add(data);
      console.log('IPFS response:', res);
      console.log('IPFS URL:', BASE_IPFS_URL + res.path);
      
      setStatus('Adding contract to blockchain...');
      const receipt = await addContractToBlockchain(res.path);
      
      setStatus('Contract added successfully!');
      console.log('Transaction receipt:', receipt);
      
      // Reset form
      setContractAddress('');
      setContractName('');
      setContractDescription('');
      setContractCode('');
    } catch (error) {
      console.error('Error adding contract:', error);
      setStatus('Error adding contract');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:container bg-gray-900 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-blue-400">Add New Smart Contract</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-300">
            Contract Address
          </label>
          <input
            type="text"
            id="contractAddress"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="contractName" className="block text-sm font-medium text-gray-300">
            Contract Name
          </label>
          <input
            type="text"
            id="contractName"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="contractDescription" className="block text-sm font-medium text-gray-300">
            Contract Description
          </label>
          <textarea
            id="contractDescription"
            value={contractDescription}
            onChange={(e) => setContractDescription(e.target.value)}
            rows="3"
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="contractCode" className="block text-sm font-medium text-gray-300">
            Contract Code
          </label>
          <textarea
            id="contractCode"
            value={contractCode}
            onChange={(e) => setContractCode(e.target.value)}
            rows="10"
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            required
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            {loading ? 'Processing...' : 'Add Contract'}
          </button>
        </div>
      </form>
      {status && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-green-400">{status}</p>
        </div>
      )}
    </div>
  );
};

export default AddContract;