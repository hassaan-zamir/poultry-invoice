/* eslint-disable @next/next/no-css-tags */
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { InvoiceType } from "..";
import Head from "next/head";
import { useReactToPrint } from "react-to-print";

export default function AdvanceSlip() {
  const router = useRouter();
  const componentRef = useRef(null);

  const [invoice, setInvoice] = useState<InvoiceType | null>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getChallanNo = (d: string, id: number): string => {
    const date = new Date(d);
    return `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}-${id}`;
  };
  const fetchInvoice = async (id: string | string[] | undefined) => {
    if (!id) return;

    try {
      const resp = await axios.post("/api/getInvoice", { id: id });
      setInvoice(resp.data.invoice);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchInvoice(router.query.id);
  }, [router]);

  if (!invoice) {
    return <p>Please wait...</p>;
  }

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/posPrint.css"/>
      </Head>
      <table
        ref={componentRef}
        style={{ textAlign: "center", background: "#fff", color: "#000", border:'none' }}
        border={1} cellSpacing={10}
      >
        <tbody>
          <tr>
            <th colSpan={4}>Golden Poulty Farms</th>
          </tr>
          <tr>
            <td colSpan={4}>Contact: 0317825800 , 0317825900</td>
          </tr>
          <tr>
            <th>Date</th>
            <td>{new Date(invoice.date).toISOString().substr(0, 10)}</td>
            <th>Challan#</th>
            <td>{getChallanNo(invoice.date, invoice.id)}</td>
          </tr>

          <tr>
            <th>Shed</th>
            <td>{invoice.shed}</td>
            <th>Broker</th>
            <td>{invoice.broker_name}</td>
          </tr>

          <tr>
            <th>Vehicle</th>
            <td>{invoice.vehicle_no}</td>
            <th>Driver</th>
            <td>{invoice.driver_name}</td>
          </tr>

          <tr>
            <th>Cash</th>
            <td>{invoice.cash}</td>
            <th>Online</th>
            <td>{invoice.online}</td>
          </tr>

          <tr>
            <th colSpan={2}>Total Advance</th>
            <td colSpan={2}>{invoice.cash + invoice.online}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={handlePrint}>Print this out!</button>
    </>
  );
}
