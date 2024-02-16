import React, { useEffect, useMemo, useState } from "react";
import { Empty, InvoiceCard, Loader, Page } from "../../components";
import All from "../../assets/images/InvoiceIcons/Draft.png";
import Paid from "../../assets/images/InvoiceIcons/Paid.png";
import Overdue from "../../assets/images/InvoiceIcons/Overdue.png";
import Pending from "../../assets/images/InvoiceIcons/Unpaid.png";
import { base_url } from "../../utils/url";

const getInvoices = `${base_url}/get-all-invoice-admin`;

const images = { All, Paid, Overdue, Pending };
const Invoices = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  console.log("data", data);

  useEffect(() => {
    const fetchInvoices = () => {
      setLoading(true);

      fetch(getInvoices)
        .then((res) => res.json())
        .then((res) => setData(res.success.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    };

    fetchInvoices();
  }, []);

  const filteredData = useMemo(() => {
    if (filter === "all") return data;
    return data.filter((item) => item.status.toLowerCase() === filter);
  }, [data, filter]);

  return (
    <Page title="Invoices" enableHeader>
      <main>
        <div className="flex items-center justify-center space-x-4 text-sm">
          {["All", "Paid", "Overdue", "Pending"].map((item) => (
            <button
              onClick={() => setFilter(item.toLowerCase())}
              className={`p-2 text-center text-gray-400 rounded-full px-[17px] ${
                filter === item.toLowerCase() ? "bg-primary-400" : ""
              }`}
            >
              <img
                width={30}
                src={images[item]}
                alt={item.toLowerCase() + "_invoices"}
                className="mx-auto"
              />
              {item}
            </button>
          ))}
        </div>

        <div
          className={
            loading
              ? "relative min-h-[60vh] flex justify-center items-center"
              : "flex flex-col space-y-1 mt-5"
          }
        >
          {loading ? (
            <Loader />
          ) : filteredData.length > 0 ? (
            filteredData.map((invoice) => (
              <InvoiceCard key={invoice.id} {...invoice} />
            ))
          ) : (
            <Empty title="No invoices found!" />
          )}
        </div>
      </main>
    </Page>
  );
};

export default Invoices;
