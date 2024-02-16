import { VscClose } from "react-icons/vsc";
import Button from "../../Buttons/Button";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { useSelector } from "react-redux";

const InvoiceDetailsModal = ({ invoiceModal, setInvoiceModal }) => {
  const user = useSelector((state) => state.user);
  const data = invoiceModal.data;
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
          {profileImage ? (
            <img
              className="w-[100px] h-[100px] rounded-full object-cover object-center border mx-auto"
              src={profileImage}
              alt="profile"
            />
          ) : (
            <div className="w-[100px] h-[100px] rounded-full border text-4xl mx-auto flex justify-center text-gray-400 items-center bg-gray-200">
              <HiMiniBuildingOffice />
            </div>
          )}
          <span className="font-semibold capitalize">
            {fcData?.facility_name}
          </span>

          <table className="w-full -mt-2 overflow-hidden rounded-lg">
            <tbody className="border">
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
                <th className="px-2 py-1.5 font-semibold">Invoice Status:</th>
                <td className="text-xs text-gray-700">{data?.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.footer}>
          <Button
            title="Generate PDF"
            handleClick={close}
            extraStyles={styles.footerCloseButton}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsModal;
