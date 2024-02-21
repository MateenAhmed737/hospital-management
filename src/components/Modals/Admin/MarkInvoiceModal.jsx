import React, { useState } from "react";
import { VscClose } from "react-icons/vsc";
import { Button } from "../../Buttons";
import toast from "react-hot-toast";

const MarkInvoiceModal = ({
  data,
  markInvoiceModal,
  setMarkInvoiceModal,
  markInvoiceUrl,
  reload
}) => {
  const initialState = { bank_name: "", transaction_id: "" };
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleMarkInvoice = (e) => {
    e.preventDefault();
    setLoading(true);

    const url = `${markInvoiceUrl}${data?.id}`;
    const formData = new FormData();
    formData.append("bank_name", state.bank_name);
    formData.append("transaction_id", state.transaction_id);

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast.success("Invoice Updated!");
          setState(initialState);
          reload && reload();
          close();
        }
      })
      .finally(() => setLoading(false));
  };

  //   console.log('data', data)

  const close = () => {
    setMarkInvoiceModal(false);
  };

  const styles = {
    modal: {
      base: "fixed inset-0 flex !mt-0 justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity px-5",
      open: markInvoiceModal
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none",
    },
    content: "bg-white rounded-md w-full max-w-sm",
    header: "flex justify-between items-center py-2 px-4 border-b",
    main: {
      base: "p-4 overflow-y-auto max-h-[70vh]",
      grid: `grid grid-cols-1 gap-4`,
    },
    footer: "flex justify-end py-3 px-4 border-t",
    closeButton:
      "text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-base p-1.5 ml-auto inline-flex items-center",
    input:
      "min-h-[37px] w-[300px] shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500/50 focus:border-blue-600 block p-2.5",
    createButton: `!w-full !rounded-md ${loading ? "!py-1.5" : "!py-2.5"}`,
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
      <form onSubmit={handleMarkInvoice} className={styles.content}>
        <div className={styles.header}>
          <h2 className="text-lg font-semibold">Update Invoice</h2>
          <button onClick={close} className={styles.closeButton}>
            <VscClose />
          </button>
        </div>
        <div
          className={`${styles.main.base} ${styles.main.grid} ${styles.main.gap}`}
        >
          <div className="col-span-1 sm:col-span-2">
            <label
              htmlFor="transaction_id"
              className="block mb-2 text-xs font-medium text-left text-gray-900 capitalize"
            >
              Transaction ID
            </label>
            <input
              type="text"
              name="transaction_id"
              id="transaction_id"
              value={state.transaction_id}
              onChange={handleChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required={true}
              autoFocus={true}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label
              htmlFor="bank_name"
              className="block mb-2 text-xs font-medium text-left text-gray-900 capitalize"
            >
              Bank Name
            </label>
            <input
              type="text"
              name="bank_name"
              id="bank_name"
              value={state.bank_name}
              onChange={handleChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required={true}
              autoFocus={true}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <Button
            type="submit"
            title="Mark Paid"
            extraStyles={styles.createButton}
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default MarkInvoiceModal;
