import { useEffect, useState } from "react";
import { adminSupportService } from "../services";
import { useSelector } from "react-redux";
import { Button, Loader, Page } from "../components";
import { IoMdArrowRoundBack, IoMdSend } from "react-icons/io";
import { MdImage } from "react-icons/md";
import { cn } from "../lib/utils";

const chatId = 16;
const profile = {
  name: "Admin Support",
  profile_picture: "/public/android-chrome-192x192.png",
};

const scrollToBottom = () => {
  const elem = document.getElementById("chats-container");
  setTimeout(() => {
    elem.scrollTo({ behavior: "smooth", top: elem.scrollHeight });
  }, 500);
};

function AdminSupport() {
  const user = useSelector((state) => state.user);
  const [data, setData] = useState({ chats: [], loading: true });
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = (e) => {
    const name = e.target.name;
    const isMedia = name === "media";
    const file = isMedia && e.target.files[0];
    const fileType = isMedia && file.type.split("/")[0];
    const messageType = isMedia ? fileType : "text";
    const shouldClearMessage = message.trim() !== "" && !isMedia;

    if ((isMedia && !file) || (!isMedia && message.trim() === "")) return;

    setSending(true);

    adminSupportService
      .store_message(chatId, user, messageType, message, file)
      .then(() => {
        scrollToBottom();
        shouldClearMessage && setMessage("");
      })
      .finally(() => setSending(false));
  };

  useEffect(() => {
    if (!user) return;
    function getChats(canSetLoadingState = false, scroll = false) {
      if (canSetLoadingState) setData((prev) => ({ ...prev, loading: true }));

      adminSupportService
        .get_messages(chatId, user)
        .then((res) => {
          scroll && scrollToBottom();
          setData({ chats: res?.messages || [], loading: false });
        })
        .finally(() => setData((prev) => ({ ...prev, loading: false })));
    }

    getChats(true, true);
    const interval = setInterval(getChats, 5000);

    return () => clearInterval(interval);
  }, [user]);

  console.log("data.chats", data.chats);

  return (
    <Page title="Admin Support" containerStyles="!p-0 flex flex-col">
      {/* Header */}
      <header className="flex items-center px-3 py-3 space-x-2.5 border-b">
        <button
          className="flex items-center justify-center transition-all duration-300 rounded-full outline-none focus:border focus:bg-gray-200 focus:border-gray-500 size-10 hover:bg-gray-200 active:bg-gray-100"
          onClick={() => window.history.back()}
        >
          <IoMdArrowRoundBack className="text-xl text-gray-600 hover:text-gray-800" />
        </button>
        <div>
          <img
            className="bg-gray-100 border rounded-full min-w-12 min-h-12 size-12"
            src={profile?.profile_picture}
            alt="profile"
          />
        </div>

        <div className="flex flex-col items-start">
          <span className="font-semibold">{profile?.name}</span>
          {/* <span className="text-xs">{profile.data?.status}</span> */}
        </div>
      </header>
      {/* Chats */}
      <main
        id="chats-container"
        className={cn("p-3 relative flex flex-col h-full overflow-y-auto", {
          "justify-center items-center text-sm text-gray-500":
            data.loading || !data.chats.length,
        })}
      >
        {data.loading ? (
          <Loader />
        ) : data.chats.length ? (
          data.chats.map((item, indx) => (
            <Message
              key={"message-" + item.message_id}
              {...item}
              user={user}
              chat_details={profile}
              prev_message={indx !== 0 && data.chats.at(indx - 1)}
            />
          ))
        ) : (
          "No messages yet!"
        )}
      </main>
      {/* Message Input */}
      <footer className="p-2.5 flex items-center space-x-2 w-full border-t bg-gray-50">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-2.5 py-3 text-sm bg-gray-200 border border-transparent rounded-md outline-none focus:border-gray-500 transition-all duration-300"
          onKeyDown={(e) => e.key === "Enter" && handleSend(e)}
          placeholder="Type a message..."
          disabled={sending}
        />
        <input
          type="file"
          name="media"
          id="attatch-file"
          className="hidden"
          onChange={handleSend}
          disabled={sending}
          accept="image/*"
        />
        <button
          type="button"
          onClick={() => document.getElementById("attatch-file").click()}
          className="w-12 p-0 text-gray-500 transition-all duration-300 bg-gray-200 rounded-full outline-none hover:text-gray-700 hover:border hover:border-gray-500 focus:border focus:border-gray-500 h-11"
          disabled={sending}
        >
          <MdImage className="mx-auto text-xl" />
        </button>
        <Button
          loading={sending}
          handleClick={() =>
            handleSend({ target: { value: message, name: "message" } })
          }
          extraStyles={`!flex !items-center !justify-center !rounded-full !w-12 !h-11 !p-0 ${
            sending ? "!pl-2 !pt-px" : ""
          }`}
        >
          {!sending && <IoMdSend className="text-xl" />}
        </Button>
      </footer>
    </Page>
  );
}

const Message = (data) => {
  const {
    message_id,
    user_massage: message,
    data_type,
    sender_id,
    time_ago,
    prev_message,
    chat_details,
    user,
  } = data;
  // if this msg is sent by current user
  const isMe = sender_id == user.id;

  // if user of previous msg is same as current
  const isPrevMsgUserSame = prev_message?.sender_id === sender_id;

  // if data_type of this msg is text
  const isText = data_type === "text";

  const isImage = data_type === "images" || data_type === "image";
  const isVideo = data_type === "video";
  const isMedia = isImage || isVideo;

  const styles = {
    image: `w-10 h-10 ${isMe ? "ml-3" : "mr-3"} ${
      isPrevMsgUserSame ? "invisible" : ""
    } border rounded-full bg-center object-cover object-center`,
    para: `relative max-w-[60%] sm:max-w-[300px] flex text-white flex ${
      isPrevMsgUserSame ? "!rounded-lg" : ""
    } ${
      isMe
        ? "bg-primary-500 rounded-lg rounded-tr-none self-end"
        : "bg-gray-600 rounded-lg rounded-tl-none self-start"
    } p-2 mb-0.5 shadow-md`,
    indicator: `${
      isPrevMsgUserSame ? "invisible" : ""
    } border-y-[10px] border-transparent absolute -top-[6.4px] ${
      isMe
        ? "border-r-[10px] border-l-0 border-r-primary-500 rounded-tr-md -right-[7px] rotate-45"
        : "border-l-[10px] border-r-0 border-l-gray-600 rounded-tl-md -left-[7px] -rotate-45"
    }`,
  };

  return (
    <div
      id={"message-" + message_id}
      className={isMe ? "flex flex-row-reverse" : "flex"}
    >
      <img
        className={styles.image}
        src={isMe ? user?.profile_image : chat_details?.profile_picture}
        alt={"profile-" + message_id}
      />

      <div className={styles.para}>
        <div className={`block break-all ${isText ? "max-w-[70%]" : ""}`}>
          {isImage && (
            <img
              className="w-[300px] h-[200px] object-cover object-center rounded-lg"
              src={message}
              alt={"media-" + message_id}
            />
          )}
          {isVideo && (
            <video
              className="min-h-[50px] min-w-[100px] w-full rounded-lg"
              src={message}
              controls
            ></video>
          )}
          {!isMedia && message}
        </div>
        <span
          className={`${
            isMedia
              ? `absolute bottom-1 right-2 shadow-sm ${
                  isMe ? "bg-primary-500" : "bg-gray-600"
                } rounded-tl-md pl-1.5 pt-0.5`
              : "pt-3 pl-4"
          } text-xs text-gray-300`}
        >
          {time_ago}
        </span>
        <div className={styles.indicator} />
      </div>
    </div>
  );
};

export default AdminSupport;
