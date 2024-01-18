export const getInputType = (key) => {
  const str = key.toLowerCase();

  if (str.includes("password")) {
    return "password";
  } else if (str.includes("email")) {
    return "email";
  } else if (str.includes("phone")) {
    return "tel";
  } else if (str.includes("color")) {
    return "color";
  } else if (str.includes("date" && str.includes("time"))) {
    return "datetime-locale";
  } else if (str.includes("date")) {
    return "date";
  } else if (str.includes("time")) {
    return "time";
  } else if (
    str === "number" ||
    str.includes("amount") ||
    str.includes("zip_code") ||
    str.includes("code") ||
    str.includes("work_budget") ||
    str.includes("salary") ||
    str.includes("costing") ||
    str.includes("sin_number")
  ) {
    return "number";
  } else {
    return "text";
  }
};

export const convertPropsToObject = (neededProps) =>
  Object.fromEntries(
    neededProps.map((item) =>
      typeof item === "object" ? [item.to, ""] : [item, ""]
    )
  );

export const parseJson = (value) => {
  let copy = typeof value === "string" ? JSON.parse(value) : value;
  return typeof copy === "string" ? JSON.parse(copy) : copy;
};

export const modifyData = (data, neededProps, isSingleObject) => {
  let keys = Object.keys(isSingleObject ? data : data.length ? data[0] : {});

  const updateObj = (obj) =>
    neededProps.map((key, indx) => {
      if (typeof key === "object") {
        let value = obj[key.from];

        return [key.to, value];
      } else if (keys.includes(key.replace(/^_/, ""))) {
        let value = obj[key.replace(/^_/, "")];

        return [key, value];
      } else {
        let value = obj[key];

        return [key, value];
      }
    });

  return isSingleObject
    ? Object.fromEntries(updateObj(data))
    : data?.map((obj) => Object.fromEntries(updateObj(obj)));
};

export const fetchData = async ({
  url,
  sort,
  setData,
  callback,
  neededProps,
  requestOptions,
  setIsLoading,
}) => {
  setIsLoading && setIsLoading(true);
  try {
    const res = await fetch(url, requestOptions || undefined);
    const json = await res.json();

    console.log("response =>", json);
    if (json.success) {
      let data = json.success.data.length
        ? modifyData(json.success.data, neededProps)
        : json.success.data;
      data = sort && data?.length ? sort(data) : data;

      setData && setData(data);
      callback && callback(data);
    } else if (json.error) {
      setData && setData([]);
      callback && callback([]);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading && setIsLoading(false);
  }
};
