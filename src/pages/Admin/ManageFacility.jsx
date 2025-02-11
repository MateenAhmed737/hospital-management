import React, { useEffect, useState } from "react";
import { convertPropsToObject, fetchData, modifyData } from "../../utils";
import { base_url } from "../../utils/url";
import GeneralPage from "../GeneralPage";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { AccessDenied } from "../Auth";
import { Country, State } from "country-state-city";

const neededProps = [
  "id",
  "_role_id",
  "profile_image",
  "facility_email",
  "facility_name",
  "_password",
  "phone_number",
  "_device_name",
  "_device_token",
  "_information",
  "_name_contact",
  "_address_1",
  "_address_2",
  // "online_status",
  // "account_status",
  "_platform_fee",
  "_country",
  "_state",
  "zip_code",
  "status",
  "_hourly_rate",
  // "created_at",
  // "updated_at",
];
const template = convertPropsToObject(neededProps);
const getAdmins = `${base_url}/get-facility`;
const editUrl = `${base_url}/update-user`;
const createUrl = `${base_url}/user-registration`;

const ManageFacility = () => {
  const user_permissions = useSelector((state) => state.user?.permissions);
  const [, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paginatedData, setPaginatedData] = useState({
    items: [],
    curItems: [],
  });

  const hasViewAccess = user_permissions?.view.includes("Facility");
  const hasEditAccess = user_permissions?.update.includes("Facility");
  const hasAddAccess = user_permissions?.add.includes("Facility");

  const search = (e) => {
    const str = e.target.value;
    setSearchText(str.trim());

    if (str.trim() === "") {
      setPaginatedData((prev) => ({ ...prev, items: data }));
    } else {
      setPaginatedData((prev) => ({
        ...prev,
        items: data.filter((item) =>
          Object.keys(template).some((key) =>
            String(item?.[key])?.toLowerCase()?.includes(str?.toLowerCase())
          )
        ),
      }));
    }
  };

  const editCallback = (res) => {
    const resData = modifyData(res?.success?.data, neededProps, true);
    const newState = data.map((item) =>
      item.id === resData.id ? resData : item
    );
    setData(newState);
    setPaginatedData((prev) => ({ ...prev, items: newState }));

    // console.log("response ===>", resData);
  };

  const createCallback = (res) => {
    const resData = modifyData(res?.success?.data, neededProps, true);
    const newState = [resData, ...resData];
    setData(newState);
    setPaginatedData((prev) => ({ ...prev, items: newState }));

    // console.log("response ===>", resData);
  };

  const uploadFields = [
    {
      key: "profile_image",
      title: "profile_image",
      canUploadMultiple: false,
    },
  ];

  const dropdownFields = [
    {
      key: "status",
      title: "status",
      arr: ["Active", "Inactive"],
      getOption: (val) => val,
    },
    {
      key: "_country",
      title: "country",
      arr: Country.getAllCountries(),
      getOption: (val) => val.name,
      getValue: (val) => val.isoCode,
    },
    {
      key: "_state",
      title: "state",
      arr: (state) =>
        state._country ? State.getStatesOfCountry(state._country) : [],
      getOption: (val) => val.name,
    },
  ];

  const appendableFields = [
    {
      key: "profile_image",
      appendFunc: (key, state, formdata) => {
        if (state?.constructor === FileList) {
          Object.keys(state).forEach((item) => {
            formdata.append(`${key}[${item}]`, state);
            // console.log(`${key}[${item}]`, state);
          });
        } else {
          formdata.append(`${key}`, state);
          // console.log(`${key}`, state);
        }
      },
    },
    {
      key: "hourly_rate",
      appendFunc: (key, value, formdata) => {
        formdata.append(key, JSON.stringify(value));
      },
    },
    {
      key: "country",
      appendFunc: (key, value, formdata) => {
        formdata.append(`${key}`, Country.getCountryByCode(value).name);
        // console.log(`${key}`, Country.getCountryByCode(value).name);
      },
    },
  ];

  const props = {
    title: "Manage Facility",
    actionCols: ["Edit", "View"],
    data,
    setData,
    template,
    isLoading,
    actions: {
      hasEditAccess,
    },
    search: {
      type: "text",
      onChange: search,
      placeholder: "Search by Name, Email, Phone, Status...",
    },
    pagination: {
      paginatedData,
      setPaginatedData,
      curLength: paginatedData.items.length,
    },
    createModalProps: {
      textAreaFields: ["_about"],
      initialState: template,
      createUrl,
      neededProps,
      uploadFields,
      appendableFields,
      excludeFields: [
        "id",
        "_created_at",
        "_updated_at",
        "role_id",
        "_device_name",
        "_device_token",
        "_hourly_rate",
      ],
      dropdownFields,
      hideFields: ["_role_id"],
      successCallback: createCallback,
      required: true,
      handleClick: (setState) =>
        hasAddAccess
          ? setState((prev) => ({ ...prev, isOpen: true }))
          : toast.error("You don't have access to create on this page!"),
    },
    editModalProps: {
      textAreaFields: ["_about"],
      template,
      neededProps,
      initialStateFunc: (data) => ({
        ...data,
        _country: Country.getAllCountries().find(
          (e) => e.name === data._country
        )?.isoCode,
      }),
      uploadFields,
      appendableFields,
      editUrl,
      excludeFields: [
        "_device_name",
        "_device_token",
        "_created_at",
        "_updated_at",
        "_password",
      ],
      dropdownFields,
      hideFields: ["id", "_role_id"],
      successCallback: editCallback,
    },
    viewModalProps: {
      excludeFields: [
        "_created_at",
        "_updated_at",
        "_role_id",
        "_password",
        "_hourly_rate",
      ],
      longFields: ["_about"],
      imageFields: ["profile_image"],
    },
  };

  useEffect(() => {
    fetchData({
      neededProps,
      url: getAdmins,
      setIsLoading,
      sort: (data) => data?.sort((a, b) => b.id - a.id),
      callback: (data) => {
        setData(data);
        setPaginatedData((prev) => ({ ...prev, items: data }));
      },
    });
  }, []);

  if (!hasAddAccess || !hasEditAccess || !hasViewAccess)
    return <AccessDenied />;

  return <GeneralPage {...props} />;
};

export default ManageFacility;
