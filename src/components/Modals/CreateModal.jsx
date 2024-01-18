import React, { useMemo, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { getInputType } from "../../utils";
import { DropdownField, TextArea, UploadField } from "../Fields";

import Button from "../Buttons/Button";
import toast from "react-hot-toast";

const CreateModal = ({
  createUrl,
  createModal,
  setCreateModal,
  gridCols = 2,
  excludeFields = ["id"],
  textAreaFields = ["address"],
  appendableFields = [],
  dropdownFields = [],
  uploadFields = [],
  inputFields = [],
  hideFields = [],
  required = true,
  neededProps,
  successCallback,
  initialState,
}) => {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  console.log("state", state);

  const uploadKeys = uploadFields.map((e) => e.key);
  const dropdownKeys = dropdownFields.map((e) => e.key);
  const inputKeys = inputFields.map((e) => e.key);

  const keys = Object.keys(state).filter((e) => !excludeFields.includes(e));
  const handleInputChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formdata = new FormData();
      const appendableKeys = appendableFields.map((e) => e.key);
      keys.forEach((item) => {
        let key = neededProps.find(
          (elem) => elem?.to === item || elem === item
        );
        key = typeof key === "object" ? key.from : key.replace(/^_/, "");

        console.log(key, state[item]);

        if (appendableKeys.includes(key)) {
          const data = appendableFields?.[appendableKeys.indexOf(key)];
          data?.appendFunc(key, state[item], formdata);
        } else {
          formdata.append(key, state[item]);
        }
      });

      const requestOptions = {
        headers: {
          accept: "application/json",
        },
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      const res = await fetch(createUrl, requestOptions);
      const json = await res.json();

      console.log("json", json);

      if (json?.error?.status === 400) {
        toast.error(json.error.message);
      } else if (json.success) {
        successCallback && successCallback(json);
        close();
      }
    } catch (error) {
      toast.error("Unable to create!", { duration: 2000 });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const close = () => {
    setCreateModal({ ...createModal, isOpen: false });
  };

  const styles = {
    modal: {
      base: "fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity",
      open: createModal.isOpen
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none",
    },
    content: `bg-white rounded-md w-full mx-5 ${
      gridCols === 2 ? "max-w-xl" : "max-w-xs"
    }`,
    header: "flex justify-between items-center py-3 px-4 border-b",
    main: {
      base: "p-4 overflow-y-auto max-h-[70vh]",
      grid: `grid grid-cols-${gridCols} gap-4`,
      get() {
        return `${this.base} ${this.grid}`;
      },
    },
    footer: "flex justify-end py-3 px-4 border-t",
    closeButton:
      "text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-base p-1.5 ml-auto inline-flex items-center",
    input:
      "w-full shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500/50 focus:border-blue-600 block p-2.5",
    createButton: `!w-full !rounded-md ${isLoading ? "!py-2" : "!py-3"}`,
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  const setValue = (key, value) => {
    setState({ ...state, [key]: value });
  };

  return (
    <div
      className={`${styles.modal.base} ${styles.modal.open}`}
      onClick={handleBackdropClick}
    >
      <form onSubmit={handleSubmit} className={styles.content}>
        <div className={styles.header}>
          <h2 className="text-lg font-semibold">Create</h2>
          <button type="button" onClick={close} className={styles.closeButton}>
            <VscClose />
          </button>
        </div>
        <div className={styles.main.get()}>
          {keys.map((elem) => {
            if (hideFields.includes(elem)) return null;

            if (textAreaFields.includes(elem)) {
              return (
                <TextArea
                  {...{
                    key: elem,
                    elem,
                    gridCols,
                    state: state[elem],
                    setState: (val) => setValue(elem, val),
                    required,
                  }}
                />
              );
            } else if (uploadKeys.includes(elem)) {
              const index = uploadKeys.indexOf(elem);
              const data = index !== -1 ? uploadFields[index] : {};

              return (
                <UploadField
                  {...{
                    ...data,
                    state: state[elem],
                    setState: (val) => setValue(elem, val),
                    required: data?.hasOwnProperty("required")
                      ? data.required
                      : required,
                  }}
                />
              );
            } else if (dropdownKeys.includes(elem)) {
              const index = dropdownKeys.indexOf(elem);
              const data = index !== -1 ? dropdownFields[index] : {};

              const arr =
                typeof data.arr === "function" ? data.arr(state) : data.arr;

              return (
                <DropdownField
                  {...{
                    ...data,
                    state: state[elem],
                    setState: (val) => setValue(elem, val),
                    required,
                    arr,
                  }}
                />
              );
            } else {
              const hasElement = inputKeys.includes(elem);
              const props = hasElement
                ? inputFields?.[inputKeys.indexOf(elem)]
                : {};

              return (
                <div key={elem} className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor={elem}
                    className="block mb-1 text-xs font-medium capitalize"
                  >
                    {elem.replace(/_/g, " ")}
                  </label>
                  <input
                    type={getInputType(elem)}
                    id={elem}
                    name={elem}
                    value={state[elem] || ""}
                    onChange={
                      hasElement && props.hasOwnProperty("handleChange")
                        ? (e) => props.handleChange(e, initialState, setState)
                        : handleInputChange
                    }
                    className={styles.input}
                    required={required}
                    max={
                      hasElement && props.hasOwnProperty("max")
                        ? props.max(initialState)
                        : undefined
                    }
                    {...props}
                  />
                </div>
              );
            }
          })}
        </div>
        <div className={styles.footer}>
          <Button
            type="submit"
            title="Create"
            isLoading={isLoading}
            extraStyles={styles.createButton}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateModal;
