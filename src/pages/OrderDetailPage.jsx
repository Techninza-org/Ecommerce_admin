import { useEffect, useState } from "react";
import google from "/google.png";
import { useParams } from "react-router-dom";

const OrderPage = () => {
  const orderId = useParams().id;
  const [orderDetails, setOrderDetails] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No API token found in local storage.");
        }
        const response = await fetch(
          `http://45.198.14.69/api/admin/getGenerateInvoiceDataByOrderId/${orderId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOrderDetails(data.orderDetails);
        setCompanyDetails(data.companyDetails);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orderId]);

  const calculateTotalAmount = () => {
    return orderDetails?.orderProducts
      ?.reduce((total, product) => total + product.amount, 0)
      .toFixed(2);
  };

  return (
    <div
      className="container mt-5 border rounded-3"
      style={{
        backgroundColor: "#f8f9fa",
        margin: "auto",
        width: "50%",
        zIndex: 10,
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        className="bg-purple text-white p-4"
        style={{ backgroundColor: "#6f42c1", zIndex: 10, position: "relative" }}
      >
        <table style={{ width: "100%", zIndex: 10 }}>
          <tbody>
            <tr>
              <td>
                <h1>Invoice</h1>
                <img
                  src={google}
                  alt="Company Logo"
                  style={{ height: "100px", zIndex: 10 }}
                />
              </td>
              <td style={{ textAlign: "right" }}>
                <h3>{companyDetails?.companyName || "Your Company"}</h3>
                <p>
                  {companyDetails?.addressText}
                  <br />
                  {companyDetails?.city}, {companyDetails?.country}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Billing Info */}
      <div
        className="p-4 text-black"
        style={{ zIndex: 10, position: "relative" }}
      >
        <table className="table" style={{ width: "100%", zIndex: 10 }}>
          <tbody>
            <tr style={{ zIndex: 10, position: "relative" }}>
              <td style={{ zIndex: 10, position: "relative" }}>
                <h5>BILL TO:</h5>
                <p>
                  {orderDetails?.orderAddress?.addressText}
                  <br />
                  {orderDetails?.orderAddress?.city}, <br />
                  {orderDetails?.orderAddress?.state}
                  <br />
                  {orderDetails?.orderAddress?.country}, <br />
                  {orderDetails?.orderAddress?.pincode}
                </p>
              </td>
              <td
                style={{
                  textAlign: "right",
                  zIndex: 10,
                  position: "relative",
                }}
              >
                <p>
                  <strong>INVOICE</strong>
                  <br /> {orderDetails?.id}
                  <br />
                  <strong>DATE</strong>
                  <br />{" "}
                  {new Date(orderDetails?.createdAt).toLocaleDateString()}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Items Table */}

      <table
        className="table border-2 text-center text-black"
        style={{
          zIndex: 10,
          width: "100%",
          position: "relative",
        }}
      >
        <thead>
          <tr className="text-center ">
            <th>Items</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Tax</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails?.orderProducts?.map((product, index) => (
            <tr key={index}>
              <td>{product.productId}</td>
              <td>{product.description}</td>
              <td>{product.quantity}</td>
              <td>{product.amount}</td>
              <td>{product.couponAmount}</td>
              <td>{product.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Notes and Total */}
      <div
        className="p-4 text-black"
        style={{ zIndex: 10, position: "relative" }}
      >
        <table
          className="table"
          style={{ backgroundColor: "#f8f9fa", width: "100%" }}
        >
          <tbody style={{ zIndex: 10 }}>
            <tr>
              <td>
                {/* <h5>NOTES:</h5>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> */}
              </td>
              <td style={{ textAlign: "right", width: "50%" }}>
                <h1>Total Amount</h1>
                <h1>{calculateTotalAmount()}</h1>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-black" style={{ zIndex: 10, position: "relative" }}>
        <table
          className="table mt-2"
          style={{
            width: "100%",
          }}
        >
          <tbody style={{ zIndex: 10 }}>
            <tr>
              <td></td>
              <td
                style={{
                  textAlign: "right",
                  width: "100%",
                }}
              >
                <img
                  src={google}
                  style={{
                    height: "100px",
                    position: "absolute",
                    right: "10px",
                  }}
                  alt="Google Logo"
                />
                <br />
                <h5 className="m-2" style={{ marginTop: "80px" }}>
                  Authorized Signature
                </h5>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        className="bg-dark text-center p-3 text-"
        style={{ zIndex: 10, position: "relative" }}
      >
        <p>Powered by Wave</p>
        <p>
          This invoice was generated with the help of Wave Financial Inc. Visit{" "}
          <a href="https://waveapps.com" className="text-white">
            waveapps.com
          </a>{" "}
          for more details.
        </p>
      </div>
    </div>
  );
};

export default OrderPage;
