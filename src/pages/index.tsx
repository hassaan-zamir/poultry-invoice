import Head from "next/head";
import { useState, useEffect, ChangeEvent } from "react";
import Loading from "@/components/Loading";
import axios from "axios";
import Sheds from "@/components/Sheds";
import Houses from "@/components/Houses";
import DataTable from "react-data-table-component";
import Brokers from "@/components/Brokers";

export async function getServerSideProps() {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/getMasterData"
  );
  const brokers = res.data.brokers;
  const sheds = res.data.sheds;
  const invoices = res.data.invoices;

  return { props: { sheds, invoices, brokers } };
}

export interface BrokerType {
  id: string;
  name: string;
}

export interface ShedsMasterDataType {
  id: string;
  name: string;
  houses: string[];
}

export interface InvoiceType {
  add_less: number;
  broker_name: string;
  cash: number;
  commission: number;
  date: string;
  driver_name: string;
  first_weight: number;
  house_no: string;
  id: number;
  online: number;
  paid: number;
  second_weight: number;
  shed: string;
  todays_rate: number;
  vehicle_no: string;
}

interface PropTypes {
  sheds: ShedsMasterDataType[];
  invoices: InvoiceType[];
  brokers: BrokerType[];
}

export default function Home({ sheds, invoices, brokers }: PropTypes) {
  const [mutatedInvoices, setMutatedInvoices] =
    useState<InvoiceType[]>(invoices);
  const [n, forceUpdate] = useState<number>();

  const [mutatedSheds, setMutatedSheds] =
    useState<ShedsMasterDataType[]>(sheds);

  const [mutatedBrokers, setMutatedBrokers] = useState<BrokerType[]>(brokers);

  const [loading, setLoading] = useState<boolean>(true);

  const [challanNo, setChallanNo] = useState<string | null>(null);
  const [date, setDate] = useState<string>("");
  const [shedNo, setShedNo] = useState<string>("");
  const [houseNo, setHouseNo] = useState<string>("");
  const [todaysRate, setTodaysRate] = useState<number | null>(null);
  const [brokerName, setBrokerName] = useState<string>("");
  const [addLess, setAddLess] = useState<number | null>(null);
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [cash, setCash] = useState<number | null>(null);
  const [online, setOnline] = useState<number | null>(null);
  const [firstWeight, setFirstWeight] = useState<number | null>(null);
  const [secondWeight, setSecondWeight] = useState<number | null>(null);
  const [paid, setPaid] = useState<boolean>(false);
  const [commission, setCommission] = useState<number | null>(null);

  const columns = [
    {
      name: "ID",
      selector: (row: InvoiceType) => row.id,
    },
    {
      name: "Date",
      selector: (row: InvoiceType) => row.date,
    },
    {
      name: "Shed",
      selector: (row: InvoiceType) => row.shed,
    },
    {
      name: "House",
      selector: (row: InvoiceType) => row.house_no,
    },

    {
      name: "Broker",
      selector: (row: InvoiceType) => row.broker_name,
    },
    {
      name: "Driver",
      selector: (row: InvoiceType) => row.driver_name,
    },
    {
      name: "Cash",
      selector: (row: InvoiceType) => row.cash,
    },
    {
      name: "Online",
      selector: (row: InvoiceType) => row.online,
    },
    {
      name: "Commission",
      selector: (row: InvoiceType) => row.commission,
    },
    {
      name: "Today's Rate",
      selector: (row: InvoiceType) => row.todays_rate,
    },
    {
      name: "1st Wgt",
      selector: (row: InvoiceType) => row.first_weight,
    },
    {
      name: "2nd Wgt",
      selector: (row: InvoiceType) => row.second_weight,
    },
    {
      name: "Status",
      selector: (row: InvoiceType) => row.paid,
    },
  ];

  const clearInputs = () => {
    setCash(null);
    setOnline(null);
    setVehicleNo("");
    setDriverName("");
    setFirstWeight(null);
    setSecondWeight(null);
    setCommission(null);
  };

  useEffect(() => {
    const getDefaultBroker = (): string => {
      if (mutatedBrokers.length > 0) {
        return mutatedBrokers[0].name;
      }
      return "";
    };

    const getDefaultShed = (): string => {
      if (mutatedSheds.length > 0) {
        return mutatedSheds[0].name;
      }
      return "";
    };

    const getDefaultHouse = (): string => {
      if (mutatedSheds.length > 0) {
        if (mutatedSheds[0].houses.length > 0) {
          return mutatedSheds[0].houses[0];
        }
      }
      return "";
    };

    const checkAvailable = (
      value: string | null,
      type: string
    ): string | null => {
      if (value) {
        if (type == "shed-no") {
          const findShed = mutatedSheds.find((shed) => shed.name == value);
          if (findShed) {
            return value;
          }
        } else if (type == "house-no") {
          const findShed = mutatedSheds.find((shed) => shed.name == shedNo);
          if (findShed) {
            const findHouse = findShed.houses.find((house) => house == value);
            if (findHouse) {
              return value;
            }
          }
        } else if (type == "broker-name") {
          const findBroker = mutatedBrokers.find(
            (broker) => broker.name == value
          );
          if (findBroker) {
            return value;
          }
        }
      }

      return null;
    };
    (async () => {
      try {
        if (typeof localStorage !== "undefined") {
          const defaultShedNo =
            checkAvailable(localStorage.getItem("shed-no"), "shed-no") ??
            getDefaultShed();
          const defaultHouseNo =
            checkAvailable(localStorage.getItem("house-no"), "house-no") ??
            getDefaultHouse();

          const defaultBrokerName =
            checkAvailable(
              localStorage.getItem("broker-name"),
              "broker-name"
            ) ?? getDefaultBroker();
          setShedNo(defaultShedNo);
          setHouseNo(defaultHouseNo);
          setBrokerName(defaultBrokerName);

          const defaultDate =
            localStorage.getItem("date") ??
            new Date().toISOString().substr(0, 10);
          const defaultTodaysRate = Number(
            localStorage.getItem("t-rate") ?? "0"
          );
          const defaultAddless = Number(
            localStorage.getItem("add-less") ?? "0"
          );
          setAddLess(defaultAddless);
          setTodaysRate(defaultTodaysRate);

          setDate(defaultDate);
        }

        const resp = await axios.post("/api/getChallanNo");
        if (resp.data.challanNo) {
          const currentDate = new Date();
          const formattedDate = `${
            currentDate.getMonth() + 1
          }/${currentDate.getDate()}/${currentDate.getFullYear()}`;
          const fullChallanNo = formattedDate + "-" + resp.data.challanNo;

          setChallanNo(fullChallanNo);
        }
      } catch (e) {
        console.log("Error while generating challan no", e);
      }
      setLoading(false);
    })();
  }, [mutatedBrokers, mutatedSheds, shedNo]);

  if (loading) {
    return <Loading />;
  }

  if (!challanNo) {
    return <p>Error generating challan no. Please try refreshing..</p>;
  }

  const formatNumber = (value: string): string => {
    const newVal = value.replace(/^0+/, "");
    return newVal;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "date":
        localStorage.setItem("date", value);
        setDate(value);
        break;
      case "t_rate":
        localStorage.setItem("t-rate", value);
        setTodaysRate(Number(formatNumber(value)));
        break;
      case "cash":
        setCash(Number(formatNumber(value)));
        break;
      case "first_weight":
        setFirstWeight(Number(formatNumber(value)));
        break;
      case "second_weight":
        setSecondWeight(Number(formatNumber(value)));
        break;
      case "add_less":
        localStorage.setItem("add-less", value);
        setAddLess(Number(formatNumber(value)));
        break;
      case "vehicle_no":
        setVehicleNo(value);
        break;
      case "online":
        setOnline(Number(formatNumber(value)));
        break;
      case "driver_name":
        setDriverName(value);
        break;
      case "commission":
        setCommission(Number(formatNumber(value)));
        break;
      default:
        break;
    }
  };

  const getFinalRate = (): number => {
    if (!todaysRate || !addLess) {
      return 0;
    }
    return Number(todaysRate) + Number(addLess);
  };

  const getTotalAdvance = (): number => {
    return Number(cash) + Number(online);
  };

  const getNetWeight = (): number => {
    return Number(secondWeight) - Number(firstWeight);
  };

  const getTotalAmount = (): number => {
    return getFinalRate() * getNetWeight();
  };

  const getBalance = (): number => {
    return getTotalAmount() - getTotalAdvance();
  };

  const addInvoice = async () => {
    if (driverName.trim() == "") {
      alert("Driver name is required");
    } else if (vehicleNo.trim() == "") {
      alert("Vehicle no is required");
    } else if (confirm("Are you sure?")) {

      if(firstWeight && secondWeight){
        if(secondWeight <= firstWeight){
          alert("Second weight should be greater than first weight");
          return;
        }
      }
      try {
        const resp = await axios.post("/api/addInvoice", {
          vehicle_no: vehicleNo,
          date,
          shed: shedNo,
          house_no: houseNo,
          broker_name: brokerName,
          driver_name: driverName,
          first_weight: firstWeight,
          second_weight: secondWeight,
          todays_rate: todaysRate,
          add_less: addLess ?? 0,
          cash: cash ?? 0,
          online: online ?? 0,
          commission: commission ?? 0,
          paid: paid ? 1 : 0,
        });

        if (resp.data.invoice) {
          alert("Invoice added successfully");
          const newInvoices = mutatedInvoices;
          newInvoices.unshift(resp.data.invoice);
          setMutatedInvoices(newInvoices);
          forceUpdate(Math.random());
          clearInputs();
          setLoading(true);
          const resp2 = await axios.post("/api/getChallanNo");
          if (resp2.data.challanNo) {
            const currentDate = new Date();
            const formattedDate = `${
              currentDate.getMonth() + 1
            }/${currentDate.getDate()}/${currentDate.getFullYear()}`;
            const fullChallanNo = formattedDate + "-" + resp2.data.challanNo;

            setChallanNo(fullChallanNo);
          }
          setLoading(false);
        }
      } catch (e) {
        alert("Could not create invoice. Please try again");
        console.log("Error while adding new invoice", e);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Poultry Invoice</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="text-center">
        <h1>Challan Form</h1>
      </section>

      <table id="invoice-form">
        <tbody>
          <tr>
            <td colSpan={2}>
              <div className="form-group">
                <label>Challan No</label>
                <input type="text" disabled value={challanNo ?? ""} />
              </div>
            </td>
            <td colSpan={2}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  name="date"
                  onChange={handleInputChange}
                />
              </div>
            </td>
            <td>
              <Sheds
                sheds={mutatedSheds}
                shedNo={shedNo}
                setShedNo={setShedNo}
                setSheds={setMutatedSheds}
              />
            </td>
            <td>
              <Houses
                sheds={mutatedSheds}
                houseNo={houseNo}
                setHouseNo={setHouseNo}
                shed_selected={shedNo}
                setSheds={setMutatedSheds}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className="form-group">
                <label>Today&apos;s rate</label>
                <input
                  type="text"
                  name="t_rate"
                  value={todaysRate ?? ""}
                  onChange={handleInputChange}
                />
              </div>
            </td>
            <td colSpan={2}>
              <div className="form-group">
                <label>Rate Add/Less</label>
                <input
                  type="text"
                  name="add_less"
                  value={addLess ?? ""}
                  onChange={handleInputChange}
                />
              </div>
            </td>
            <td colSpan={2}>
              <div className="form-group">
                <label>Final Rate</label>
                <input
                  type="text"
                  name="final_rate"
                  value={getFinalRate()}
                  disabled
                />
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <Brokers
                brokers={mutatedBrokers}
                broker={brokerName}
                setBroker={setBrokerName}
                setBrokers={setMutatedBrokers}
              />
              {/* <div className="form-group">
                <label>Broker Name</label>
                <input
                  type="text"
                  name="broker_name"
                  value={brokerName}
                  onChange={handleInputChange}
                />
              </div> */}
            </td>
            <td colSpan={2}>
              <div className="form-group">
                <label>Vehicle No</label>
                <input
                  type="text"
                  name="vehicle_no"
                  value={vehicleNo}
                  onChange={handleInputChange}
                />
              </div>
            </td>
            <td colSpan={2}>
              <div className="form-group">
                <label>Driver Name</label>
                <input
                  type="text"
                  name="driver_name"
                  value={driverName}
                  onChange={handleInputChange}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className="form-group">
                <label>Cash</label>
                <input
                  type="number"
                  name="cash"
                  value={cash ?? ""}
                  onChange={handleInputChange}
                />
              </div>
            </td>
            <td colSpan={2}>
              <div className="form-group">
                <label>Online</label>
                <input
                  type="text"
                  name="online"
                  value={online ?? ""}
                  onChange={handleInputChange}
                />
              </div>
            </td>
            <td colSpan={2}>
              <div className="form-group">
                <label>Total Advance</label>
                <input
                  type="text"
                  name="total_advance"
                  disabled
                  value={getTotalAdvance()}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className="form-group">
                <label>First Weight</label>
                <input
                  type="text"
                  name="first_weight"
                  value={firstWeight ?? ""}
                  onChange={handleInputChange}
                />
              </div>
            </td>
            <td colSpan={2}>
              <div className="form-group">
                <label
                  className={
                    (secondWeight ?? 0) <= (firstWeight ?? 0) ? "warning" : ""
                  }
                >
                  Second Weight
                </label>
                <input
                  type="text"
                  name="second_weight"
                  value={secondWeight ?? ""}
                  onChange={handleInputChange}
                />
              </div>
            </td>
            <td colSpan={2}>
              <div className="form-group">
                <label>Net Weight</label>
                <input
                  type="text"
                  name="net_weight"
                  disabled
                  value={getNetWeight()}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className="form-group">
                <label>Total Amount</label>
                <input
                  type="text"
                  name="total_amount"
                  disabled
                  value={getTotalAmount()}
                />
              </div>
            </td>
            <td colSpan={2}>
              <div className="form-group">
                <label>Balance</label>
                <input
                  type="text"
                  name="balance"
                  disabled
                  value={getBalance()}
                />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label>Paid</label>
                <input
                  type="checkbox"
                  name="paid"
                  checked={paid}
                  onChange={() => setPaid(!paid)}
                />
              </div>
            </td>
            <td>
              <div className="form-group">
                <label>Commission</label>
                <input
                  type="text"
                  name="commission"
                  value={commission ?? ""}
                  onChange={handleInputChange}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <section id="action-buttons">
        <button
          type="button"
          id="add_invoice"
          className="success-btn"
          onClick={addInvoice}
        >
          Create
        </button>
        <button type="button" id="update_invoice" className="info-btn">
          Update
        </button>
        <button type="button" id="delete_invoice" className="danger-btn">
          Delete
        </button>
      </section>

      <section id="table">
        <DataTable key={n} columns={columns} data={mutatedInvoices} />
      </section>
    </>
  );
}
