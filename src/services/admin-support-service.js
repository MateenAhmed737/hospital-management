import axios from "axios";

export const get_messages = async (id, currentUser) => {
  const isAdmin = currentUser.role_id == "2";
  const sender_id = isAdmin ? 16 : currentUser.id;
  const reciever_id = isAdmin ? id : 16;

  return axios
    .post("/get-admin-chat", { sender_id, reciever_id })
    .then((res) => res.data)
    .then((res) => {
      if (res?.success == true) {
        return res;
      } else {
        throw res;
      }
    });
};

export const get_inbox = async (id) => {
  if (!id) return console.info("Invalid ID passed");

  return axios
    .get("/inbox/" + id)
    .then((res) => res.data)
    .then((res) => {
      if (res?.success) {
        return res;
      } else {
        throw res;
      }
    });
};
