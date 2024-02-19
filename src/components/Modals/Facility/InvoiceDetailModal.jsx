import { VscClose } from "react-icons/vsc";
import Button from "../../Buttons/Button";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { Margin, Resolution, usePDF } from "react-to-pdf";
import moment from "moment";
import Img from "../../../assets/images/Logos/colorlogo.png";

const InvoiceDetailsModal = ({ invoiceModal, setInvoiceModal }) => {
  const { toPDF, targetRef } = usePDF({
    filename: `Anee-${moment(new Date()).format("DD-MMM-YYYY")}.pdf`, page: {
      // default is `save`
      method: 'open',
      // default is Resolution.MEDIUM = 3, which should be enough, higher values
      // increases the image quality but also the size of the PDF, so be careful
      // using values higher than 10 when having multiple pages generated, it
      // might cause the page to crash or hang.
      resolution: Resolution.HIGH,
      page: {
         // margin is in MM, default is Margin.NONE = 0
         margin: Margin.SMALL,
         // default is 'A4'
         format: 'letter',
         // default is 'portrait'
         orientation: 'landscape',
      },
      canvas: {
         // default is 'image/jpeg' for better size performance
         mimeType: 'image/png',
         qualityRatio: 1
      },
      // Customize any value passed to the jsPDF instance and html2canvas
      // function. You probably will not need this and things can break, 
      // so use with caution.
      overrides: {
         // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
         pdf: {
            compress: true
         },
         // see https://html2canvas.hertzen.com/configuration for more options
         canvas: {
            useCORS: true
         }
      },
   }
  });
  const user = useSelector((state) => state.user);
  const data = invoiceModal.data;
  const isByAdmin = data?.invoice_by === "Admin";
  console.log("data ==>", data);

  const fcData = data?.[user.isAdmin ? "user" : "facility"];
  const profileImage = fcData?.profile_image;

  const close = () => setInvoiceModal((prev) => ({ ...prev, isOpen: false }));

  const styles = {
    modal: {
      base: "fixed inset-0 !mt-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity px-5",
      open: invoiceModal.isOpen
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none",
    },
    content: "bg-white rounded-md w-full max-w-md",
    header: "flex justify-between items-center py-2 px-4 border-b",
    main: {
      base: "p-4 overflow-y-auto max-h-[70vh]",
      grid: `grid grid-cols-1 gap-4`,
    },
    footer: "flex py-3 px-4 border-t justify-evenly space-x-3",
    closeButton:
      "text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-base p-1.5 ml-auto inline-flex items-center",
    input:
      "min-h-[37px] w-[300px] shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500/50 focus:border-blue-600 block p-2.5",
    boostBtn: `!w-5/6 !rounded-md !py-2.5`,
    deleteBtn: `!size-9 !rounded-md !p-0 !bg-red-500 hover:!bg-red-600 !ring-red-200`,
    editBtn: `!size-9 !rounded-md !p-0 !bg-primary-500 hover:!bg-primary-600 !ring-primary-100`,
    footerCloseButton: `!w-full !rounded-md !py-2.5`,
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  return (
    <div
      className={`${styles.modal.base} ${styles.modal.open}`}
      onClick={handleBackdropClick}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className="text-lg font-semibold">Invoice Details</h2>
          <button onClick={close} className={styles.closeButton}>
            <VscClose />
          </button>
        </div>
        <div
          className={`${styles.main.base} ${styles.main.grid} ${styles.main.gap} text-center`}
        >
          {!isByAdmin &&
            (profileImage ? (
              <img
                className="w-[100px] h-[100px] rounded-full object-cover object-center border mx-auto"
                src={profileImage}
                alt="profile"
              />
            ) : (
              <div className="w-[100px] h-[100px] rounded-full border text-4xl mx-auto flex justify-center text-gray-400 items-center bg-gray-200">
                <HiMiniBuildingOffice />
              </div>
            ))}
          <span className="font-semibold capitalize">
            {fcData?.facility_name}
          </span>

          {isByAdmin && (
            <div className="flex items-center justify-between px-1 py-2 -mt-5 text-sm">
              <span>{data?.title}</span>
              <span className="text-primary-500">
                ${Number(data?.amount || 0).toFixed(2)}
              </span>
            </div>
          )}

          <table className="w-full -mt-2 overflow-hidden rounded-lg">
            <tbody className="border">
              {!isByAdmin && (
                <>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">Due Date:</th>
                    <td className="text-xs text-gray-700">{data?.due_date}</td>
                  </tr>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">From:</th>
                    <td className="text-xs text-gray-700">{data?.from}</td>
                  </tr>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">To:</th>
                    <td className="text-xs text-gray-700">{data?.to}</td>
                  </tr>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">Total Amount:</th>
                    <td className="text-xs text-gray-700">
                      ${Number(data?.total_amount || 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">
                      Invoice Status:
                    </th>
                    <td className="text-xs text-gray-700">{data?.status}</td>
                  </tr>
                </>
              )}
              {isByAdmin && (
                <>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">Client:</th>
                    <td className="text-xs text-gray-700">{data?.client}</td>
                  </tr>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">Telephone:</th>
                    <td className="text-xs text-gray-700">{data?.telephone}</td>
                  </tr>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">Email:</th>
                    <td className="text-xs text-gray-700">
                      {data?.email || "N/A"}
                    </td>
                  </tr>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">Company:</th>
                    <td className="text-xs text-gray-700">{data?.company}</td>
                  </tr>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">VAT:</th>
                    <td className="text-xs text-gray-700">%{data?.vat}</td>
                  </tr>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">Address:</th>
                    <td className="text-xs text-gray-700">{data?.address}</td>
                  </tr>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">Details:</th>
                    <td className="text-xs text-gray-700">{data?.details}</td>
                  </tr>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">Bill to:</th>
                    <td className="text-xs text-gray-700">{data?.bill_to}</td>
                  </tr>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">Amount Due:</th>
                    <td className="text-xs text-gray-700">
                      ${Number(data?.amount_due || 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">Payment Due:</th>
                    <td className="text-xs text-gray-700">{data?.due_date}</td>
                  </tr>
                  <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                    <th className="px-2 py-1.5 font-semibold">
                      Invoice status:
                    </th>
                    <td
                      className={`text-xs font-medium ${
                        data?.status === "Unpaid"
                          ? "text-red-500"
                          : data?.status === "Paid"
                          ? "text-green-500"
                          : "text-gray-700"
                      }`}
                    >
                      {data?.status}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.footer}>
          <Button
            title="Generate PDF"
            handleClick={() => toPDF()}
            extraStyles={styles.footerCloseButton}
          />
        </div>
      </div>

      {/* Invoice */}
      <div className="absolute translate-y-full">
        <div
          className="w-full p-6 mx-2 my-6 bg-white border rounded shadow-sm "
          id="invoice"
          ref={targetRef}
        >
          <div className="grid items-center grid-cols-2">
            <div className="text-left">
              <p>NURSE STAFFING & CONCIERGE SERVICE</p>
              <p>{data?.user?.facility_name || data?.bank_name}</p>
              <p>EAU CLAIRE, WI 54701</p>
            </div>

            <div className="flex items-center justify-end">
              {/* <!--  Company logo  --> */}
              <img src={Img} alt="company-logo" height="100" width="100" />
            </div>
          </div>

          {/* <!-- Client info --> */}
          <div className="grid items-center grid-cols-2 mt-8">
            <div className="text-gray-500">
              <p>{data?.address}</p>
            </div>

            <div className="text-right">
              <h1 className="leading-[5px] font-medium text-gray-800">
                INVOICE
              </h1>
              <p className="mt-3 space-x-2">
                <span className="font-semibold text-left">Invoice #</span>
                <span className="font-semibold text-right text-gray-500">
                  {data?.transaction_id}
                </span>
              </p>
              <p className="space-x-2">
                <span className="font-semibold text-left">Invoice Date</span>
                <span className="font-semibold text-right text-gray-500">
                  {data?.created_at}
                </span>
              </p>
              <p className="space-x-2">
                <span className="font-semibold text-left">Due Date</span>
                <span className="font-semibold text-right text-gray-500">
                  {data?.due_date}
                </span>
              </p>
            </div>
          </div>

          {/* <!-- Invoice Items --> */}
          <div className="flow-root mt-8 -mx-4 sm:mx-0">
            <table className="min-w-full">
              <colgroup>
                <col className="sm:w-1/6" />
                <col className="w-full sm:w-1/2" />
                <col className="sm:w-1/6" />
                <col className="sm:w-1/6" />
              </colgroup>
              <thead className="text-gray-900 border-b border-gray-300">
                <tr className="bg-blue-400">
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-white sm:table-cell"
                  >
                    item
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-right text-sm font-semibold text-white sm:table-cell"
                  >
                    Unit Price
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-right text-sm font-semibold text-white sm:table-cell"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-white"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="border">
                <tr className="border-b border-gray-200">
                  <td className="py-3.5 pl-4 pr-3 text-sm max-w-0">
                    <div className="font-medium text-gray-900">Service</div>
                  </td>
                  <td className="hidden px-3 py-3.5 text-sm text-left text-gray-500 sm:table-cell">
                    Late Fee
                  </td>
                  <td className="hidden px-3 py-3.5 text-sm text-right text-gray-500 sm:table-cell">
                    $100.00
                  </td>
                  <td className="hidden px-3 py-3.5 text-sm text-right text-gray-500 sm:table-cell">
                    12.00
                  </td>
                  <td className="py-3.5 pl-3 pr-4 text-sm text-right text-gray-500">
                    $12000.00
                  </td>
                </tr>

                {/* <!-- Notes --> */}
                <tr>
                  <td colSpan="6" className="h-[100px]" />
                </tr>
                <tr>
                  <td colSpan="6" className="p-4 text-gray-500">
                    <span>
                      <u>NOTES:</u> Service Date: 05/14/2023-05/20/2023
                    </span>
                    <br />
                    <span>*Payment due 30 days from invoice date</span>
                    <br />
                    <span>
                      *Any unpaid balances after 30 days from the date of
                      receipt at the compound rate of 3 % per day (Annual
                      Percentage Rate of 10%) or the maximum legal rate,
                      whichever is higher, calculated from the date of receipt.
                    </span>
                    <br />
                    <span>Employee: [Name], [Name], [Name], [Name]</span>
                    <br />
                    <span>08/01/23: 11 days late, late fee: $1000.00</span>
                    <br />
                    <span>08/07/23: 17 days late, Late fee: $1000.00</span>
                    <br />
                    <br />
                    <span>
                      08/15/23: Check #14297 Amount paid: $${data?.total_amount}{" "}
                      ({data?.address})
                    </span>
                    <br />
                    <span>Remaining balance: 25 days late $12000.00</span>
                    <br />
                    <span>
                      *09/12/23-53 days late, late fee $12000.00 not paid
                    </span>
                  </td>
                </tr>
              </tbody>
              <tfoot className="border-r">
                <tr>
                  <th
                    scope="row"
                    colSpan="3"
                    className="hidden pt-6 pl-4 pr-3 text-sm font-normal text-center text-gray-500 sm:table-cell sm:pl-0"
                  >
                    &nbsp;
                  </th>
                  <th
                    scope="row"
                    colSpan="1"
                    className="pt-6 pl-4 pr-3 text-sm font-normal text-center text-gray-500 border-b border-l sm:table-cell sm:pl-0"
                  >
                    Subtotal
                  </th>
                  <td className="pt-6 !pr-6 text-sm text-center text-gray-500 border-b sm:pr-0">
                    ${data?.sd}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan="3"
                    className="hidden pt-6 pl-4 pr-3 text-sm font-normal text-center text-gray-500 sm:table-cell sm:pl-0"
                  >
                    &nbsp;
                  </th>
                  <th
                    scope="row"
                    colSpan="1"
                    className="pt-4 pl-4 pr-3 text-sm font-normal text-center text-gray-500 border-l sm:table-cell sm:pl-0"
                  >
                    Total
                  </th>
                  <td className="pt-4 !pr-6 text-sm text-center text-gray-500 sm:pr-0">
                    ${data?.total_amount}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan="3"
                    className="hidden pt-6 pl-4 pr-3 text-sm font-normal text-center text-gray-500 sm:table-cell sm:pl-0"
                  >
                    &nbsp;
                  </th>
                  <th
                    scope="row"
                    colSpan="1"
                    className="pt-4 pl-4 pr-3 text-sm font-normal text-center text-gray-500 border-b border-l sm:table-cell sm:pl-0"
                  >
                    Amount Paid
                  </th>
                  <td className="pt-4 !pr-6 text-sm text-center text-gray-500 border-b sm:pr-0">
                    0.00
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan="3"
                    className="hidden pt-6 pl-4 pr-3 text-sm font-normal text-center text-gray-500 sm:table-cell sm:pl-0"
                  >
                    &nbsp;
                  </th>
                  <th
                    scope="row"
                    colSpan="1"
                    className="py-2 pl-4 pr-3 text-sm font-semibold text-center text-gray-900 border-b border-l sm:table-cell sm:pl-0"
                  >
                    Balance Due
                  </th>
                  <td className="py-2 !pr-4 text-sm font-semibold text-center text-gray-900 border-b sm:pr-0">
                    $10,500.00
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsModal;
