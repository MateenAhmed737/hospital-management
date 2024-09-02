import { useEffect, useMemo, useState } from "react";
import {
  CreateModal,
  Empty,
  InvoiceCard,
  InvoiceDetailsModal,
  Loader,
  Page,
} from "../../components";
import All from "../../assets/images/InvoiceIcons/Draft.png";
import Paid from "../../assets/images/InvoiceIcons/Paid.png";
import Overdue from "../../assets/images/InvoiceIcons/Overdue.png";
import Pending from "../../assets/images/InvoiceIcons/Unpaid.png";
import { base_url } from "../../utils/url";
import { useSelector } from "react-redux";
import { convertPropsToObject } from "../../utils";
import { cn } from "../../lib/utils";
import toast from "react-hot-toast";

const getFacilityInvoices = `${base_url}/facility-invoice/`;
const getAllInvoices = `${base_url}/get-all-invoice-admin`;
const createUrl = `${base_url}/store-admin-invoice`;
const getFacilities = `${base_url}/get-facility`;

const filters = ["All", "Paid", "Overdue", "Pending"];
const neededProps = [
  "title",
  "total_amount",
  "facility_id",
  "due_date",
  "description",
  // "transaction_id",
  // "bank_name",
  // "client",
  // "telephone",
  // "email",
  // "company",
  // "vat",
  // "bill_to",
  // "address",
];

const initialState = convertPropsToObject(neededProps);

const images = { All, Paid, Overdue, Pending };
const Invoices = () => {
  const user = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [createModal, setCreateModal] = useState({ isOpen: false, data: null });
  const [invoiceModal, setInvoiceModal] = useState({
    isOpen: false,
    data: null,
  });

  const hasAddAccess = user?.permissions?.add?.includes("Invoice");

  const filteredData = useMemo(() => {
    if (filter === "all") return data;
    return data.filter((item) => item.status.toLowerCase() === filter);
  }, [data, filter]);

  const createModalProps = {
    title: "Create Invoice",
    createUrl: createUrl,
    createModal,
    neededProps,
    initialState,
    setCreateModal,
    textAreaFields: ["address", "description"],
    dropdownFields: [
      {
        key: "facility_id",
        title: "facility",
        arr: facilities,
        getOption: (val) => val.facility_name,
        getValue: (val) => val.id,
      },
    ],
    successCallback: (res) => {
      if (res.success) {
        setReload(!reload);
        toast.success("Invoice created successfully!");
      }
    },
    required: true,
    gridCols: 2,
  };
  const invoiceListProps = {
    loading,
    filteredData,
    setInvoiceModal,
    setReload,
  };

  console.log('data', data)

  useEffect(() => {
    const fetchInvoices = () => {
      setLoading(true);
      const reqUrl = user.isAdmin
        ? getAllInvoices
        : getFacilityInvoices + user.id;

      fetch(reqUrl)
        .then((res) => res.json())
        .then((res) => setData(res.success.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    };
    const fetchFacilities = () => {
      setLoading(true);
      fetch(getFacilities)
        .then((res) => res.json())
        .then((res) => setFacilities(res.success.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    };

    fetchInvoices();
    fetchFacilities();
  }, [user.id, user.isAdmin, reload]);

  return (
    <Page title="Invoices" enableHeader>
      <main className="relative">
        <div className="flex items-center justify-center space-x-4 text-sm">
          <Filters filter={filter} setFilter={setFilter} />
        </div>

        {/* Create New */}
        {user.isAdmin && hasAddAccess && (
          <div className="flex items-center justify-between p-3 mt-5 rounded-md bg-primary-100">
            <span className="text-sm font-semibold">Create New Invoice</span>
            <button
              onClick={() =>
                setCreateModal((prev) => ({ ...prev, isOpen: true }))
              }
              className="p-2 px-6 text-xs text-gray-100 rounded-full hover:bg-primary-700 bg-primary-600"
            >
              Start Now
            </button>
          </div>
        )}

        <div
          className={
            loading
              ? "relative min-h-[60vh] flex justify-center items-center"
              : "flex flex-col space-y-1 mt-5 pb-5"
          }
        >
          <InvoiceList {...invoiceListProps} />
        </div>

        {user.isAdmin && <CreateModal {...createModalProps} />}
        <InvoiceDetailsModal
          invoiceModal={invoiceModal}
          setInvoiceModal={setInvoiceModal}
        />
      </main>
    </Page>
  );
};

function InvoiceList({ loading, filteredData, setInvoiceModal, setReload }) {
  if (loading) return <Loader />;
  if (!filteredData.length) {
    return <Empty title="No invoices found!" />;
  }

  return filteredData.map((invoice) => (
    <InvoiceCard
      key={invoice.id}
      invoice={invoice}
      onClick={() => setInvoiceModal({ isOpen: true, data: invoice })}
      reload={() => setReload((prev) => !prev)}
    />
  ));
}

function Filters({ filter, setFilter }) {
  return filters.map((item) => {
    const name = item.toLowerCase();
    return (
      <button
        key={item}
        onClick={() => setFilter(name)}
        className={cn("p-2 text-center text-gray-400 rounded-full size-20", {
          "bg-primary-400 !text-gray-100": filter === name,
        })}
      >
        <img
          width={30}
          src={images[item]}
          alt={name + "_invoices"}
          className="mx-auto"
        />
        {item}
      </button>
    );
  });
}

export default Invoices;
