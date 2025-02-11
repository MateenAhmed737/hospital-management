import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base_url } from "../../../utils/url";
import { Button, ConfirmationCodeFeilds } from "../../../components";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import { Country, State } from "country-state-city";

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
      const formData = new FormData();
      if (data.role_id === "3") {
        formData.append("address_1", data.Address_line_1);
        formData.append("phone_number", data.phone);
        formData.append("facility_email", data.email);
        formData.append(
          "facility_name",
          data.first_name + " " + data.last_name
        );
        formData.append("latitude", "0");
        formData.append("longitude", "0");
      }
      Object.keys(data).forEach((key) => {
        if (key === "password" || key === "confirm_password") {
          formData.append(key, data[key].value);
        } else if (key === "type_of_staff" && data.role_id !== "1") {
        } else if (key === "country") {
          formData.append("country", Country.getCountryByCode(data[key])?.name);
        } else if (key === "state") {
          formData.append("state", State.getStateByCode(data[key])?.name);
        } else {
          formData.append(key, data[key]);
        }
      });

      const requestOptions = {
        headers: {
          Accept: "application/json",
        },
        method: "POST",
        body: formData,
        redirect: "follow",
      };

      const res = await fetch(`${base_url}/user-registration`, requestOptions);
      json = await res.json();

      // console.log(json);

      if (json.success) {
        let data = json.success.data;
        data.role = roles[data.role_id];
        data.isStaff = data.role_id === "1";
        data.isAdmin = data.role_id === "2";
        data.isFacility = data.role_id === "3";

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
              <FaArrowLeft className="mr-2" />
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
