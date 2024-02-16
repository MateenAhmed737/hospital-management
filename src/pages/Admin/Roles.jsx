import React, { useEffect, useState } from "react";
import { convertPropsToObject, fetchData } from "../../utils";
import { permissions } from "../../constants/data";
import { base_url } from "../../utils/url";
import GeneralPage from "../GeneralPage";

const neededProps = ["id", "roles", "_permission", "_add", "_update", "_view"];
const template = convertPropsToObject(neededProps);

const getAdmins = `${base_url}/get-roles`;
const editUrl = `${base_url}/edit-role-permission`;
const createUrl = `${base_url}/roles-permission`;
const deleteUrl = `${base_url}/delete-role`;

const Roles = () => {
  const [, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [reload, setReload] = useState(false);
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

  const createTemplate = {
    ...template,
    _view: [],
    _add: [],
    _update: [],
  };

  const multiSelectFields = [
    {
      key: "_add",
      title: "Add",
      arr: permissions,
    },
    {
      key: "_update",
      title: "Update",
      arr: permissions,
    },
    {
      key: "_view",
      title: "View",
      arr: permissions,
    },
  ];

  const appendableFields = [
    {
      key: "view",
      appendFunc: (key, value, formdata, state) => {
        const permissions = {
          add: state._add,
          update: state._update,
          view: state._view,
        };
        console.log("permission", JSON.stringify(permissions));
        formdata.append("permission", JSON.stringify(permissions));
      },
    },
    {
      key: "add",
      appendFunc: (key, value, formdata, state) => {},
    },
    {
      key: "update",
      appendFunc: (key, value, formdata, state) => {},
    },
  ];

  const props = {
    title: "Roles",
    actionCols: ["Edit", "Delete"],
    data,
    setData,
    template,
    isLoading,
    actions: {
      deleteUrl,
      hasEditAccess: true
    },
    search: {
      type: "text",
      onChange: search,
      placeholder: "Search by ID or Role",
    },
    pagination: {
      paginatedData,
      setPaginatedData,
      curLength: paginatedData.items.length,
    },
    createModalProps: {
      textAreaFields: ["_about"],
      initialState: createTemplate,
      createUrl,
      neededProps,
      appendableFields,
      multiSelectFields,
      excludeFields: [
        "id",
        "role_id",
        "_created_at",
        "_updated_at",
        "_permission",
        "_device_name",
        "_device_token",
      ],
      hideFields: [""],
      successCallback: () => setReload(!reload),
      required: true,
      gridCols: 1,
    },
    editModalProps: {
      textAreaFields: ["_about"],
      editUrl,
      template,
      neededProps,
      appendableFields,
      multiSelectFields,
      excludeFields: [
        "role_id",
        "_password",
        "_permission",
        "_created_at",
        "_updated_at",
        "_device_name",
        "_device_token",
      ],
      hideFields: ["id"],
      successCallback: () => setReload(!reload),
      gridCols: 1,
    },
    viewModalProps: {
      excludeFields: [
        "_add",
        "_view",
        "_update",
        "role_id",
        "_permission",
        "_created_at",
        "_updated_at",
      ],
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
        const newData = data.map((item) => {
          const permissions = item?._permission;
          const _add = permissions?.add || [];
          const _update = permissions?.update || [];
          const _view = permissions?.view || [];

          return { ...item, _view, _add, _update };
        });

        setData(newData);
        setPaginatedData((prev) => ({ ...prev, items: newData }));
      },
    });
  }, [reload]);

  return <GeneralPage {...props} />;
};

export default Roles;
