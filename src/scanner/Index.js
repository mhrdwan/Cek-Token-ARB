import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Row, Col, Form, Button } from "react-bootstrap";

function Page1() {
  const [isidataapi, setIsidaApi] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isiduit, setIsiduit] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const apikey = `api-key`;
  const columns = [
    {
      name: "No",
      selector: (row) => row.no,
      width: `50px`,
    },
    {
      name: "Nama Token",
      selector: (row) => row.name,
      width: `200px`,
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
      name: "Token Address",
      selector: (row) => row.token_address,
      width: `350px`,
    },
  ];

  const datatoken = async () => {
    try {
      const isi = await axios.get(
        `https://deep-index.moralis.io/api/v2/${inputValue}/erc20?chain=arbitrum&addres`,
        {
          headers: {
            "X-API-Key": apikey,
          },
        }
      );

      const data = isi.data.map((item , index) => ({
        no : index + 1,
        name: item.name,
        symbol: item.symbol,
        balance: (item.balance / Math.pow(10, 18)).toFixed(2),
        token_address: item.token_address,
      }));

      setIsidaApi(data);
      setInputValue("");
      setErrorMessage(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("Alamat tidak ditemukan");
      } else {
        setErrorMessage("Terjadi kesalahan");
      }
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

    console.log(isiw);
  };

  const handleButtonClick = () => {
    datatoken(inputValue);
    balance(inputValue);
  };
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
              {isiduit[0]?.address}
              <h5>
                <br />
                Saldo ARB
              </h5>
              {isiduit[0]?.balance_formatted}
              <br />
              <Button variant="primary" onClick={handleButtonClick}>
                Submit
              </Button>
              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </Form>
          </Col>
        </div>
        <Col sm={{ span: 8, offset: 2 }}>
          <DataTable columns={columns} data={isidataapi} pagination />
        </Col>
      </Row>
    </div>
  );
}

export default Page1;
