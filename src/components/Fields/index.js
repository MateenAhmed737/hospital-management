import React from "react";

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
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
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
        required={required}
        value={state}
        onChange={handleChange}
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
        id={name}
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
