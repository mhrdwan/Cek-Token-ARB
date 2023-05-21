import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Row, Col, Form, Button } from "react-bootstrap";

function Page1() {
  const [isidataapi, setIsidaApi] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isiduit, setIsiduit] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const apikey = `orXONEhtfmIfKKhQ0eCIdIp9a9NCGAnP9FUs1UEMa0KYDbqJwedhZwJdkfEk8MGD`;
  const [isLoading, setIsLoading] = useState(false); 
  const [ hargaarbit , sethargaarbit] = useState([])
  const columns = [
    {
      name: "No",
      selector: (row) => row.no,
      width: "50px",
    },
    {
        name: "Nama Token",
        selector: (row) => (
          <div>
            <span>{row.name}</span>
            <br />
            <span>{row.token_address}</span>
          </div>
        ),
        width: "350px",
      },

    {
      name: "Symbol",
      selector: (row) => row.symbol,
      width: `100px`,
    },
    {
      name: "Qyt",
      selector: (row) => row.balance,
      width: `100px`,
    },
    {
        name: "Harga Token Sekarang",
        selector: (row) => `$${row.priceUsd}`,
        width: `200px`,
      },
      {
        name: "Saldo Kamu",
        selector: (row) => `$${(row.priceUsd * row.balance)}`,
        width: `150px`,
      },
      
  ];

  const datatoken = async () => {
    setIsLoading(true);
    try {
      const isi = await axios.get(
        `https://deep-index.moralis.io/api/v2/${inputValue}/erc20?chain=arbitrum&addres`,
        {
          headers: {
            "X-API-Key": apikey,
          },
        }
      );
  
      const dataWithPrice = [];
      for (const item of isi.data) {
        const hargaToken = await getHargaToken(item.token_address);
        dataWithPrice.push({
          no: dataWithPrice.length + 1,
          name: item.name,
          symbol: item.symbol,
          balance: (item.balance / Math.pow(10, 18)).toFixed(2),
          token_address: item.token_address,
          priceUsd: hargaToken, // Harga di sini
        });
      }
      setIsidaApi(dataWithPrice);
      setInputValue("");
      setErrorMessage(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("Alamat tidak ditemukan");
      } else {
        setErrorMessage("Terjadi kesalahan");
      }
    } finally {
        setIsLoading(false);  
      }
  };

  const getHargaToken = async (token_address) => {
    try {
      const res = await axios.get(
        `https://api.dexscreener.com/latest/dex/tokens/${token_address}`
      );
      return res.data.pairs?.[0].priceUsd || "Harga tidak tersedia";
    } catch (error) {
      console.error(error);
      return "Harga tidak tersedia";
    }
  };



  const balance = async () => {
    const isi = await axios.get(
      `https://deep-index.moralis.io/api/v2/wallets/balances?chain=arbitrum&wallet_addresses=${inputValue}`,
      {
        headers: {
          "X-API-Key": apikey,
        },
      }
    );

    const isiw =
      isi.data?.[0].wallet_balances?.map((item, index) => ({
        address: item.address,
        balance_formatted: item.balance_formatted,
      })) || [];
    setIsiduit(isiw);

  };

  const handleButtonClick = () => {
    datatoken(inputValue);
    balance(inputValue);
    harga();
  };

  const harga = async () => {
    const isi = await axios.get(
      `https://api.dexscreener.com/latest/dex/tokens/${isidataapi[0]?.token_address}`
    );
      const data = isi.data.pairs?.map((item, index) => ({
          index:index,
          priceUsd : item.priceUsd
      })) || [] 
  };


  const hargaArbit = async () => {
    const data = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/0x912CE59144191C1204E64559FE8253a0e49E6548`)
    const isi = data.data.pairs[6].priceUsd
    console.log( isi);
    sethargaarbit(isi)
  }

  useEffect(() => {
    harga();
    hargaArbit()
  });
  return (
    <div>
      <h1>Cek Token Di Wallet ARB Mu</h1>
      <br />
      <Row>
        <div className="d-flex justify-content-center">
          <Col sm={3}>
            <Form>
              <Form.Group className="mb-3" controlId="formInput">
                <Form.Control
                  type="text"
                  placeholder="Masukkan Address ARB 0x"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </Form.Group>

              <h5>Address Kamu Adalah</h5>
              {isiduit[0]?.address }
              <h5>
                <br />
                Saldo ARB
              </h5>
              <br />
    {isiduit[0]?.balance_formatted}
    <br />
              <br />
              <Button variant="primary" onClick={handleButtonClick}>
                Submit
              </Button>
              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </Form>
          </Col>
        </div>
        <Col sm={{ span: 8, offset: 2 }}>
          {isLoading ? (
            <h3>Loading...</h3>  
          ) : (
            <DataTable columns={columns} data={isidataapi} pagination />
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Page1;
