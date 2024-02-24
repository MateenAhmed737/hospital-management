import React, { useEffect, useState } from "react";
import { Editor, Loader, Page, Button } from "../../components";
import { base_url } from "../../utils/url";
import { replaceParaWithDivs } from "../../utils";
import { useSelector } from "react-redux";

const type = "Terms";
const edit_url = base_url + "/edit-setting";
const show_url = base_url + "/show-setting";

const TermsAndConditions = () => {
  //   const hasEditAccess = privilages.more.settings.terms.edit;
  const user = useSelector((state) => state.user);
  const [updating, setUpdating] = useState(false);
  const [state, setState] = useState({ loading: true, value: "" });

  const handleChange = (value) => setState({ value });
  const handleSubmit = async () => {
    setUpdating(true);
    try {
      let formdata = new FormData();
      formdata.append("type", type);
      formdata.append("description", replaceParaWithDivs(state.value));

      let requestOptions = {
        headers: {
          accept: "application/json",
        },
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      const res = await fetch(edit_url, requestOptions);
      const json = await res.json();

      console.log("json ===>", json);

      if (json.success) {
        const data = json.success.data;
        console.log(data);
        setState({ value: data?.description });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const fetchData = () => {
      setState({ loading: true, value: "" });

      const body = new FormData();
      body.append("type", type);

      fetch(show_url, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("data", data);
          if (data.success) {
            const description = data.success.data?.description;
            setState({ loading: false, value: description });
          }
        })
        .finally(() => setState((prev) => ({ ...prev, loading: false })));
    };

    fetchData();
  }, [user.isAdmin]);

  return (
    <Page
      title="Terms & Conditions"
      extraClasses="font-poppins p-3 pt-2 md:pt-9 md:px-5"
      enableHeader
    >
      <main className="relative min-h-[70vh]">
        {state.loading ? (
          <Loader />
        ) : user.isAdmin ? (
          <>
            <div className="grid grid-cols-1 gap-5">
              <Editor
                {...{
                  state: state.value,
                  handleChange,
                  //   readOnly: !hasEditAccess,
                }}
              />
            </div>

            <div className="flex items-center justify-end mt-2">
              <Button
                title={updating ? "Updating..." : "Update"}
                handleClick={handleSubmit}
                extraStyles="!py-2.5"
                disabled={updating}
              />
            </div>
          </>
        ) : (
          <div
            dangerouslySetInnerHTML={
              state.value ? { __html: state.value } : undefined
            }
            className="w-full pb-4 space-y-3"
          ></div>
        )}
      </main>
    </Page>
  );
};

export default TermsAndConditions;
