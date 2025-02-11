import { useEffect, useState } from "react";
import { convertPropsToObject, fetchData, modifyData } from "../../utils";
import { countries, states } from "../../constants/data";
import { base_url } from "../../utils/url";
import { useSelector } from "react-redux";
import { AccessDenied } from "../Auth";
import GeneralPage from "../GeneralPage";
import toast from "react-hot-toast";

const neededProps = ["id", "service_name", "min_amount", "details", "status"];
const template = convertPropsToObject(neededProps);
const getAdmins = `${base_url}/get-services`;
const editUrl = `${base_url}/update-service`;
const createUrl = `${base_url}/create-service`;

const ServiceTypes = () => {
  const user_permissions = useSelector((state) => state.user?.permissions);
  const [, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paginatedData, setPaginatedData] = useState({
    items: [],
    curItems: [],
  });
  const hasViewAccess = user_permissions?.view.includes("Service");
  const hasEditAccess = user_permissions?.update.includes("Service");
  const hasAddAccess = user_permissions?.add.includes("Service");

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
    toast.success("Service Type Updated Successfully");

    // console.log("response ===>", resData);
  };

  const createCallback = (res) => {
    const resData = modifyData(res?.success?.data, neededProps, true);
    const newState = [resData, ...resData];
    setData(newState);
    setPaginatedData((prev) => ({ ...prev, items: newState }));
    toast.success("Service Type Created Successfully");

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
      arr: ["Active", "Suspended"],
      getOption: (val) => val,
    },
    {
      key: "_country",
      title: "country",
      arr: countries,
      getOption: (val) => val.name,
    },
    {
      key: "_state",
      title: "state",
      arr: (state) => (state._country ? states[state._country] : []),
      getOption: (val) => val,
    },
  ];

  const props = {
    title: "Service Types",
    actionCols: ["Edit"],
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
      placeholder: "Search by Name, Amount, Details or Status",
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
      gridCols: 1,
      handleClick: (setState) =>
        hasAddAccess
          ? setState((prev) => ({ ...prev, isOpen: true }))
          : toast.error("You don't have access to create on this page!"),
    },
    editModalProps: {
      textAreaFields: ["_about"],
      template,
      neededProps,
      uploadFields,
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
      gridCols: 1,
    },
    viewModalProps: {
      excludeFields: ["_created_at", "_updated_at", "role_id", "_password"],
      longFields: ["_about"],
      imageFields: ["profile_image"],
      dollarFields: ["min_amount"],
    },
    tableProps: {
      dollarFields: ["min_amount"],
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

export default ServiceTypes;
