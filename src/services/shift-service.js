import axios from "axios";

export const get_shift = async (id) => {
    return axios
        .get("/get-single-shift/" + id)
        .then((res) => res.data)
        .then((res) => {
            if (res?.success == true) {
                return res;
            } else {
                throw res;
            }
        });
};