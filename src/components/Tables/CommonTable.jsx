import React, { useMemo } from "react";
import Actions from "../Actions";
// import { image_base_url } from "../../utils/url";

const CommonTable = ({
  state,
  setState,
  selected,
  template,
  props = {},
  setSelected,
  paginatedData,
  actionCols = [],
  hideFields = [],
  setPaginatedData,
  dollarFields = [],
  excludeFields = [],
  percentageFields = [],
  checkboxEnabled = false,
}) => {
  const keys = Object.keys(template).filter((e) => !excludeFields.includes(e));

  const removeUnderscore = (str) =>
    str.replace(/^.|_./g, (match) => match.toUpperCase()).replace(/_/g, " ");

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelected(paginatedData.curItems.map((e) => e?.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (e, data) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelected((prev) => [...prev, data?.id]);
    } else {
      setSelected((prev) => prev.filter((id) => id !== data?.id));
    }
  };

  const hasSelectedAll = useMemo(
    () =>
      paginatedData &&
      paginatedData.curItems.length !== 0 &&
      paginatedData.curItems.every((e) => selected.includes(e?.id)),
    [paginatedData, selected]
  );

  return (
    <>
      <div className="relative overflow-hidden overflow-x-auto">
        <table className="w-full overflow-hidden text-sm text-left text-black rounded-md bg-gray-50">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              {checkboxEnabled && (
                <th scope="col" className="px-6 py-3 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={hasSelectedAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer focus:ring-blue-500"
                  />
                </th>
              )}
              {keys.map(
                (elem) =>
                  elem?.at(0) !== "_" && (
                    <th
                      scope="col"
                      className="px-6 py-3 text-center"
                      key={elem}
                    >
                      {removeUnderscore(elem)}
                    </th>
                  )
              )}
              {actionCols &&
                actionCols.map((elem) => (
                  <th key={elem} scope="col" className="px-6 py-3 text-center">
                    {elem}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {state?.length ? (
              state?.map((data) => (
                <tr
                  className="border-b bg-gray-50 hover:bg-gray-100"
                  key={data.id}
                >
                  {checkboxEnabled && (
                    <td className="px-6 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(data?.id)}
                        onChange={(e) => handleSelect(e, data)}
                        id={data?.id}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer focus:ring-blue-500"
                      />
                    </td>
                  )}

                  {keys.map((key) => {
                    if (hideFields.includes(key) || key?.at(0) === "_")
                      return "";

                    return key.includes("image") && data[key] ? (
                      <td
                        key={key + data.id}
                        className="px-6 py-4 text-xs text-center whitespace-nowrap md:whitespace-normal"
                      >
                        <img
                          src={data[key]}
                          alt={key}
                          className="object-cover object-center h-10 mx-auto origin-center"
                        />
                      </td>
                    ) : percentageFields.includes(key) && data[key] ? (
                      <td
                        key={key + data.id}
                        className="px-6 py-4 text-xs text-center whitespace-nowrap md:whitespace-normal"
                      >
                        {data[key]}%
                      </td>
                    ) : dollarFields.includes(key) && data[key] ? (
                      <td
                        key={key + data.id}
                        className={`px-6 py-4 text-xs text-center whitespace-nowrap md:whitespace-normal ${
                          key === "credit/debit" &&
                          (data[key]?.[0] === "-"
                            ? "text-red-600"
                            : data[key]?.[0] === "-"
                            ? "text-green-600"
                            : "")
                        }`}
                      >
                        {data[key]?.[0] === "-"
                          ? "-$"
                          : data[key]?.[0] === "+"
                          ? "+$"
                          : "$"}
                        {Number(
                          data[key]?.[0] === "-" || data[key]?.[0] === "+"
                            ? data[key].slice(1)
                            : data[key]
                        ).toFixed(2)}
                      </td>
                    ) : key.includes("date") &&
                      key.includes("time") &&
                      data[key] ? (
                      <td
                        key={key + data.id}
                        className="px-6 py-4 text-xs text-center whitespace-nowrap md:whitespace-normal"
                      >
                        {new Date(data[key]).toLocaleString()}
                      </td>
                    ) : key.includes("date") && data[key] ? (
                      <td
                        key={key + data.id}
                        className="px-6 py-4 text-xs text-center whitespace-nowrap md:whitespace-normal"
                      >
                        {new Date(data[key]).toDateString()}
                      </td>
                    ) : key.includes("time") && data[key] ? (
                      <td
                        key={key + data.id}
                        className="px-6 py-4 text-xs text-center whitespace-nowrap md:whitespace-normal"
                      >
                        {new Date(data[key]).toTimeString()}
                      </td>
                    ) : data[key] !== null &&
                      data[key] !== undefined &&
                      data[key] !== "" ? (
                      <td
                        key={key + data.id}
                        className="px-6 py-4 text-xs text-center whitespace-nowrap md:whitespace-normal"
                      >
                        {data[key]}
                      </td>
                    ) : (
                      <td
                        className="px-6 py-4 text-xs text-center"
                        key={key + data.id}
                      >
                        -
                      </td>
                    );
                  })}

                  {actionCols && (
                    <Actions
                      {...{
                        data,
                        setData: setState,
                        id: data.id,
                        actionCols,
                        ...props,
                      }}
                    />
                  )}
                </tr>
              ))
            ) : (
              <tr className="text-center border-b bg-gray-50 hover:bg-gray-100">
                <td
                  className={`"px-6 py-4 whitespace-nowrap text-xs`}
                  colSpan={keys.length + (actionCols?.length + 1 || 0)}
                >
                  No data found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CommonTable;
