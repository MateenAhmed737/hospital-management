import React, { useEffect, useState } from "react";
import { convertPropsToObject, fetchData, modifyData } from "../../utils";
import { base_url } from "../../utils/url";
import GeneralPage from "../GeneralPage";

const neededProps = [
  "id",
  "profile_image",
  "name",
  "email",
  "phone_number",
  "_password",
  "roles",
  "_device_name",
  "_device_token",
  "_created_at",
  "_updated_at",
  "status",
];
const template = convertPropsToObject(neededProps);
const getAdmins = `${base_url}/get-admins`;
const editUrl = `${base_url}/update-user`;
const createUrl = `${base_url}/admin-register`;

const ManageAdmins = () => {
  const [, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginatedData, setPaginatedData] = useState({
    items: [],
    curItems: [],
  });

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

  const uploadFields = [
    {
      key: "profile_image",
      title: "profile_image",
      canUploadMultiple: true,
      required: false,
    },
  ];

  const dropdownFields = [
    {
      key: "roles",
      title: "roles",
      arr: roles,
      getOption: (val) => val.roles,
      getValue: (val) => val.id,
    },
    {
      key: "status",
      title: "status",
      arr: ["Active", "Inactive"],
      getOption: (val) => val,
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
          formdata.append(`${key}[0]`, state);
          console.log(`${key}[0]`, state);
        }
      },
    },
    {
      key: "roles",
      appendFunc: (key, state, formdata) => {
        formdata.append("role_id", state);
        formdata.append("roles", roles.find((e) => e.id == state).roles);
      },
    },
  ];

  const props = {
    title: "Manage Admins",
    actionCols: ["Edit", "View"],
    data,
    setData,
    template,
    isLoading,
    search: {
      type: "text",
      onChange: search,
      placeholder: "Search by Name, Email, Role, Status...",
    },
    pagination: {
      paginatedData,
      setPaginatedData,
      curLength: paginatedData.items.length,
    },
    createModalProps: {
      textAreaFields: [""],
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
      successCallback: editCallback,
    },
    editModalProps: {
      textAreaFields: [""],
      template,
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
      ],
      dropdownFields,
      hideFields: ["id"],
      successCallback: editCallback,
    },
    viewModalProps: {
      excludeFields: ["_created_at", "_updated_at", "role_id"],
    },
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${base_url}/get-roles`);
        const json = await res.json();

        if (json.success) {
          const data = json.success.data;
          setRoles(data);
          console.log("roles data ==>", data);
        }
      } catch (error) {
        console.error(error);
      }
    };

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

    fetchRoles();
  }, []);

  return <GeneralPage {...props} />;
};

export default ManageAdmins;
