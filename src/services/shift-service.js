import axios from "axios";

export const get_shift = async (id) => {
    return axios
        .get("/get-single-shift/" + id)
        .then((res) => res.data)
        .then((res) => {
            if (res?.success) {
                return res;
            } else {
                throw res;
            }
        });
};

export const break_in_out = async (user_id, shift_id, facility_id, status) => {
    return axios
        .post("/store_breaks/" + user_id, {
            status,
            shift_id,
            facility_id
        })
        .then((res) => res.data)
        .then((res) => {
            if (res?.success) {
                return res;
            } else {
                throw res;
            }
        });
};