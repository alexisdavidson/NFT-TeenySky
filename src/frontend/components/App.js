import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import './App.css';
import Mint from './Mint';

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Container, Row, Col } from 'react-bootstrap'

import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
 

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

function App() {
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [price, setPrice] = useState(0)
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [ticketsLeft, setTicketsLeft] = useState(15000)

  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    loadContracts()
  }
    
  const loadPrice = async(nft) => {
    console.log("Setting price...")
    const priceToSet = fromWei(await nft.getPrice())
    setPrice(priceToSet)
    console.log("Set price to " + priceToSet)
}

  const loadContracts = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    console.log("Load nft " + NFTAddress.address)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    
    const ticketsLeftTemp = 15000 - await nft.totalSupply()
    console.log("tickets left: " + ticketsLeftTemp)
    setTicketsLeft(ticketsLeftTemp)

    setNFT(nft)
    loadPrice(nft)
    setLoading(false)
    loadPrice(nft)
  }
  
  useEffect(() => {
  }, [])

  return (
    <BrowserRouter>
        <div className="App m-0 p-0">
            <Row className="m-0 p-0">
              <Col className="m-0 p-0">
                <Mint web3Handler={web3Handler} account={account} nft={nft} ticketsLeft={ticketsLeft} price={price} />
              </Col>
            </Row>
          <div>
            {/* <Container fluid="sm" className=" px-3 pt-3">
              <Footer />
            </Container> */}
          </div>
        </div>
    </BrowserRouter>
  );
}

export default App;
