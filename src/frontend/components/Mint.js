import { Col, Image, Row, Button, Badge } from 'react-bootstrap'
import { useState, useEffect } from 'react'
// import logo from './assets/LOGO.svg'
// import frame from './assets/Frame.svg'
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Mint = ({ web3Handler, account, nft, stats }) => {
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
                    <Col className="d-none d-lg-block m-auto col-12 col-lg-4" style={{textAlign: "right"}}>
                        {/* <Image src={frame} className="allyimage" /> */}
                    </Col>
                    <Col className="d-sm-block d-xl-none m-auto">
                        {/* <Image src={frame} className="allyimage" /> */}
                    </Col>
                    <Col className="pt-5 bigText col-12 col-lg-5">
                        <p className="p-0" style={{textAlign: "left", fontWeight: "normal"}}>
                            The Big Playhouse NFT Minting
                        </p>
                    </Col>
                    <Col className="col-3">
                    </Col>
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