import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base_url } from "../../../utils/url";
import { Button, ConfirmationCodeFeilds } from "../../../components";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const VerifyOTP = ({ data, roles, otp, setStep }) => {
  const navigate = useNavigate();
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (value) => {
    setState(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let json = null;

    if (Number(state) !== otp) {
      toast.error("Invalid OTP!", { duration: 2000 });
      setLoading(false);
      return;
    }

    try {
      const formdata = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "password" || key === "confirm_password") {
          formdata.append(key, data[key].value);
        } else if (key === "type_of_staff" && data.role_id !== "1") {
        } else if (key === "country") {
          formdata.append("country", data[key]);
        } else {
          formdata.append(key, data[key]);
        }
      });

      const requestOptions = {
        headers: {
          Accept: "application/json",
        },
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      const res = await fetch(`${base_url}/user-registration`, requestOptions);
      json = await res.json();

      console.log(json);

      if (json.success) {
        let data = json.success.data;
        data.role = roles[data.role_id];
        data.isStaff = data.role_id === "1";
        data.isAdmin = data.role_id === "2";
        data.isFacility = data.role_id === "3";
        delete data.role_id;

        toast.success("Account registered successfully!", { duration: 2000 });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(
          json.error.message === "Incorrect Credential"
            ? "Your Email or password is incorrect!"
            : json.error.message,
          { duration: 2000 }
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const config = {
    fields: 4,
    type: "number",
    autoFocus: true,
    onChange,
  };

  console.log('otp', otp)

  return (
    <>
      <form
        className="flex flex-col items-center px-4 pb-3 space-y-2"
        onSubmit={handleSubmit}
      >
        <p className="mb-3 text-xs">
          We have sent one-time password to{" "}
          <span className="font-semibold">{data.email}</span>
        </p>

        <ConfirmationCodeFeilds {...config} />
        <Button
          type="submit"
          title="Verify"
          loading={loading}
          extraStyles="!w-full !mt-6 !py-2.5 max-w-xs"
        />
        <Button
          title={
            <>
              <FaArrowLeft className="mr-2"/>
              Back
            </>
          }
          handleClick={() => setStep(1)}
          extraStyles="!w-full !py-2.5 max-w-xs"
        />
      </form>
    </>
  );
};

export default VerifyOTP;
