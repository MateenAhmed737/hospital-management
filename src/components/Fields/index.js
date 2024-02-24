import React, { useMemo } from "react";
import { MultiSelect } from "react-multi-select-component";

export const TextArea = (props) => {
  const { elem, state, setState, gridCols = 2, required = false } = props;
  const title = elem.replace(/_/g, " ").toLowerCase().trim();

  return (
    <div className={gridCols === 2 ? "col-span-2" : "col-span-1"}>
      <label
        htmlFor={title}
        className="block mb-2 text-xs font-medium text-gray-900 capitalize"
      >
        {title}
      </label>
      <textarea
        rows={8}
        name={title}
        id={title}
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg outline-none focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
        placeholder={"Write " + title + " here..."}
        required={required}
      />
    </div>
  );
};

export const DropdownField = ({
  title,
  state,
  setState,
  arr,
  getOption,
  label = true,
  required = false,
  getValue = getOption,
  emptySelection = true,
  disabled = false,
  styles = "",
}) => {
  const name = title.replace(/_/g, " ").toLowerCase();
  const handleChange = (e) => {
    const value = e.target.value;
    setState(value);
  };

  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-xs font-medium text-gray-900 capitalize"
        >
          {name}
        </label>
      )}
      <select
        id={name}
        value={state}
        onChange={handleChange}
        className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none rounded-lg border-transparent transition-all duration-300 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${styles}`}
        required={required}
        disabled={disabled}
      >
        {emptySelection && (
          <option className="text-sm" value="">
            select {name}
          </option>
        )}
        {arr.map((item, indx) => {
          const option = getOption(item);

          return (
            <option
              className="text-sm"
              key={option + indx}
              value={getValue ? getValue(item) : option}
            >
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export const UploadField = ({
  title,
  accept = "image/*",
  canUploadAnything = false,
  canUploadMultiple = false,
  required = false,
  setState,
}) => {
  const handleChange = (e) => {
    const media = canUploadMultiple ? e.target.files : e.target.files[0];
    setState(media);
  };

  return (
    <div>
      <label
        className="block mb-2 text-xs font-medium text-gray-900 capitalize"
        htmlFor={title}
      >
        {title.replaceAll("_", " ")}
      </label>
      <input
        className="block w-full text-[10px] text-gray-900 border border-gray-300 p-2 py-2 rounded-lg cursor-pointer bg-gray-50"
        id={title}
        type="file"
        onChange={handleChange}
        multiple={canUploadMultiple}
        accept={canUploadAnything ? "*" : accept}
        required={required}
      />
    </div>
  );
};

export const DateField = ({
  title,
  state,
  setState,
  required = true,
  containerStyles = "",
  titleStyles = "",
}) => {
  return (
    <div className={containerStyles}>
      <label
        className={`block mb-2 text-xs font-medium text-gray-900 capitalize ${titleStyles}`}
      >
        {title?.replace(/_/g, " ")}
      </label>
      <input
        type="date"
        defaultValue={state?.replace(" 00:00:00", "")}
        onChange={(e) => setState(e.target.value)}
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
        required={required}
      />
    </div>
  );
};

export const MultiSelectField = ({
  keyName,
  state,
  setState,
  gridCols,
  arr,
  title,
  ...props
}) => {
  console.log("state", state);
  return (
    <div>
      <label
        className="block mb-2 text-xs font-medium text-gray-900 capitalize"
        htmlFor={title}
      >
        {title.replaceAll("_", " ")}
      </label>
      <MultiSelect
        options={arr}
        value={state}
        onChange={setState}
        className="block w-full text-xs text-gray-900 rounded-lg cursor-pointer"
        labelledBy="Select"
        {...props}
      />
    </div>
  );
};

export const FacilityHourlyRates = ({
  state,
  setState,
  required = true,
  gridCols,
}) => {
  const classes = useMemo(
    () => ({
      header:
        (gridCols === 2 ? "col-span-1 sm:col-span-2" : "col-span-1") +
        " mt-6 font-semibold text-sm text-gray-700",
      field: "col-span-1",
    }),
    [gridCols]
  );

  const handleChange = (e) => {
    const indx = e.target.id;
    const value = e.target.value;

    const newState = [...state];
    newState[indx].amount = value;

    setState(newState);
  };

  return (
    <>
      <div className={classes.header}>Hourly Rates</div>

      {state.map(({ type, amount }, indx) => (
        <div className={classes.field}>
          <label className="block mb-2 text-xs font-medium text-gray-900 capitalize">
            {type?.replace(/_/g, " ")}
          </label>
          <input
            id={indx}
            type="number"
            defaultValue={amount}
            onChange={handleChange}
            className="shadow-sm bg-gray-50 border transition-all duration-300 border-gray-300 text-gray-900 text-xs rounded-lg outline-none focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            required={required}
          />
        </div>
      ))}
    </>
  );
};
