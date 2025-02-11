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

export const store_message = async (id, currentUser, type, message, file) => {
  const isAdmin = currentUser.role_id == "2";
  const role =
    currentUser.role_id == "1"
      ? "user"
      : currentUser.role_id == "2"
      ? "admin"
      : "facility";

  const sender_id = isAdmin ? 16 : currentUser.id;
  const reciever_id = isAdmin ? id : 16;
  const reciever_type = isAdmin ? "user" : "admin";
  const sender_type = role;
  const data_resource = type !== "text" ? file : undefined;
  const user_massage = type === "text" ? message : undefined;

  return axios
    .post(
      "/store-chat-admin",
      {
        sender_id,
        reciever_id,
        reciever_type,
        sender_type,
        data_resource,
        user_massage,
      },
      { headers: { "Content-Type": "multipart/form-data" } }
    )
    .then((res) => res.data)
    .then((res) => {
      if (res?.success) {
        return res;
      } else {
        throw res;
      }
    });
};

export const get_inbox = async (id) => {
  if (!id) return console.info("Invalid ID passed");

  return axios
    .get("/admin-inbox/" + id)
    .then((res) => res.data)
    .then((res) => {
      if (res?.success) {
        // console.log("res", res);
        return res;
      } else {
        throw res;
      }
    });
};
