import { Col, Image, Row, Button, Badge } from 'react-bootstrap'
import { useState, useEffect } from 'react'
// import logo from './assets/LOGO.svg'
// import frame from './assets/Frame.svg'
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Mint = ({ web3Handler, account, nft, ticketsLeft, price }) => {
    let navigate = useNavigate(); 
    const [quantity, setQuantity] = useState(1)

    const goHome = async () => {
        console.log("go home")
        navigate("/");
    }
    
    const changeQuantity = (direction) => {
        if (quantity + direction < 1)
            setQuantity(1)
        else if (quantity + direction > 10)
            setQuantity(10)
        else
            setQuantity(quantity + direction)
    }

    const mintButton = async () => {
        console.log("mint button")
        let price = fromWei(await nft.getPrice()) * quantity;
        console.log("Price: " + price + " wei");
        console.log("Quantity: " + quantity)
        await nft.mint(quantity, { value: toWei(price) });
      }

    const openseaButton = () =>  {
        var ex = document.getElementById('exOpensea');
        ex.click();
    }

    const openseaRoadmap = () =>  {
        var ex = document.getElementById('exRoadmap');
        ex.click();
    }

    return (
        <Row className="p-0 m-0">
            <Row className="px-4 pt-4 mt-3">
                <Col className="">
                    {/* <Image src={logo} className="logo ms-4 d-flex" onClick={goHome} style={{
                        width: "150px"
                    }}/> */}
                </Col>
                <Col className="col-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
                </Col>
            </Row>
            
            <Row className="mx-auto mt-5">
                <Row className="m-auto">
                    <div className="mintCount">{ticketsLeft} / 15000</div>
                </Row>
                <Row className="m-auto">
                    <div className="mintAddress">{account ? (<>{account}</>) : (<></>)}</div>
                </Row>
                <Row className="m-0 d-flex justify-content-center align-items-center">
                    <Button className="mintbutton my-3 mx-0" onClick={openseaRoadmap}>Our Journey</Button>
                    <Button className="mintbutton my-3 me-0 ms-5" onClick={openseaButton}>OpenSea</Button>
                </Row>
                <Row className="m-auto">
                    <div className="mintCost">1 teenySkySJBBs costs {price} Matic</div>
                </Row>
                <Row className="m-auto">
                    <div className="mintCost2">Excluding gas fees</div>
                </Row>
                <Row className="m-auto">
                    <div className="mintCost2">Connect to the Polygon network.</div>
                </Row>
                <Row className="pt-3 mx-auto">
                    <Col className="d-none d-lg-block col-5">
                    </Col>
                    <Col className="d-none d-lg-block col-2">
                        <span className="buttonquantity" onClick={() => changeQuantity(-1)}>-</span>
                        <span className="quantity">{quantity}</span>
                        <span className="buttonquantity" onClick={() => changeQuantity(1)}>+</span>
                    </Col>
                    <Col className=" d-sm-block d-xl-none col-12">
                        <span className="buttonquantity" onClick={() => changeQuantity(-1)}>-</span>
                        <span className="quantity">{quantity}</span>
                        <span className="buttonquantity" onClick={() => changeQuantity(1)}>+</span>
                    </Col>
                    <Col className="d-none d-lg-block col-5">
                        <a href="https://opensea.io/collection/teenyskysjbbs-collection-206957487" target="_blank" id="exOpensea"></a>
                        <a href="https://www.teenyskysjbbs.io/" target="_blank" id="exRoadmap"></a>
                    </Col>
                </Row>
                <Row className="pt-3 mx-auto">
                    {account ? (
                        <Button className="mintbutton" onClick={mintButton}>MINT</Button>
                    ) : (
                        <Button className="mintbutton" onClick={web3Handler}>CONNECT</Button>
                    )}
                </Row>
            </Row>
        </Row>
    );
}
export default Mint