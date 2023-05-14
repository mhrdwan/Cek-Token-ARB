import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Row, Col, Form, Button } from "react-bootstrap";

function Page1() {
  const [isidataapi, setIsidaApi] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const columns = [
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
            "X-API-Key":
              "YOUR-API-KEY",
          },
        }
      );

      const data = isi.data.map((item) => ({
        name: item.name,
        symbol: item.symbol,
        balance: (item.balance / Math.pow(10, 18)).toFixed(2),
        token_address: item.token_address,
      }));

      console.log(`isi`, data);
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

  useEffect(() => {
    // datatoken();
  }, []);

  const handleButtonClick = () => {
    datatoken(inputValue);
  };
  return (
    <div>
      <h1>Cek Token Apa Saja Di Wallet ARB</h1>
      <br />
      <Row>
        <div className="d-flex justify-content-center">
          <Col sm={3}>
            <Form>
              <Form.Group className="mb-3" controlId="formInput">
                <Form.Control
                  type="text"
                  placeholder="Enter text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleButtonClick}>
                Submit
              </Button>
              {errorMessage && (
                <p style={{ color: "red" }}>{errorMessage}</p> 
              )}
            </Form>
          </Col>
        </div>
        <Col sm={{ span: 8, offset: 2 }}>
          <DataTable columns={columns} data={isidataapi} />
        </Col>
      </Row>
    </div>
  );
}

export default Page1;
