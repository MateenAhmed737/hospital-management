import { useEffect, useState } from "react";
import { convertPropsToObject, fetchData, modifyData } from "../../utils";
import { Country, State } from "country-state-city";
import { base_url } from "../../utils/url";
import { useSelector } from "react-redux";
import { AccessDenied } from "../Auth";
import GeneralPage from "../GeneralPage";
import toast from "react-hot-toast";

const neededProps = [
  "id",
  "profile_image",
  "first_name",
  "last_name",
  "email",
  "_password",
  "phone",
  "_Address_line_1",
  "_Address_line_2",
  "_type_id",
  "_country",
  "_state",
  "_about",
  "_zip_code",
  "_device_name",
  "_device_token",
  "status",
  // "email_verified_at",
  // "created_at",
  // "updated_at",
  // "online_status",
  // "country_code",
];
const template = convertPropsToObject(neededProps);
const getAdmins = `${base_url}/get-users`;
const editUrl = `${base_url}/update-user`;
const createUrl = `${base_url}/user-registration`;

const ManageStaff = () => {
  const user_permissions = useSelector((state) => state.user?.permissions);
  const [, setSearchText] = useState("");
  const [staffTypes, setStaffTypes] = useState([]);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paginatedData, setPaginatedData] = useState({
    items: [],
    curItems: [],
  });
  const hasViewAccess = user_permissions?.view.includes("Staff");
  const hasEditAccess = user_permissions?.update.includes("Staff");
  const hasAddAccess = user_permissions?.add.includes("Staff");

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

    console.log("response ===>", resData);
  };
  const createCallback = (res) => {
    const resData = modifyData(res?.success?.data, neededProps, true);
    const newState = [resData, ...resData];
    setData(newState);
    setPaginatedData((prev) => ({ ...prev, items: newState }));

    console.log("response ===>", resData);
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
    {
      key: "_type_id",
      title: "type",
      arr: staffTypes,
      getOption: (val) => val.service_name,
      getValue: (val) => val.id,
    },
  ];

  const appendableFields = [
    {
      key: "profile_image",
      appendFunc: (key, state, formdata) => {
        if (state?.constructor === FileList) {
          Object.keys(state).forEach((item) => {
            formdata.append(`${key}[${item}]`, state);
            console.log(`${key}[${item}]`, state);
          });
        } else {
          formdata.append(`${key}`, state);
          console.log(`${key}`, state);
        }
        formdata.append("role_id", "1");
        console.log("role_id", "1");
      },
    },
    {
      key: "country",
      appendFunc: (key, value, formdata) => {
        formdata.append(`${key}`, Country.getCountryByCode(value).name);
        console.log(`${key}`, Country.getCountryByCode(value).name);
      },
    },
  ];

  const props = {
    title: "Manage Staff",
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
      ],
      dropdownFields,
      hideFields: [""],
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
      initialStateFunc: (data) => ({
        ...data,
        _country: Country.getAllCountries().find(
          (e) => e.name === data._country
        )?.isoCode,
      }),
      neededProps,
      uploadFields,
      appendableFields,
      editUrl,
      excludeFields: [
        "_device_name",
        "_device_token",
        "_created_at",
        "_updated_at",
        "role_id",
        "_password",
      ],
      dropdownFields,
      hideFields: ["id"],
      successCallback: editCallback,
    },
    viewModalProps: {
      excludeFields: ["_created_at", "_updated_at", "role_id", "_password"],
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
    const fetchStaffTypes = () => {
      const requestOptions = {
        headers: {
          Accept: "application/json",
        },
        method: "GET",
        redirect: "follow",
      };

      fetch(`${base_url}/get-services`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data);
          if (data.success) {
            setStaffTypes(data.success.data);
          } else {
            toast.error(data.error.message, { duration: 2000 });
          }
        })
        .catch((error) => console.error(error));
    };

    fetchStaffTypes();
  }, []);

  if (!hasAddAccess || !hasEditAccess || !hasViewAccess)
    return <AccessDenied />;

  return <GeneralPage {...props} />;
};

export default ManageStaff;
