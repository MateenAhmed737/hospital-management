import { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { Button, Loader, Page } from "../../../components";
import { base_url } from "../../../utils/url";
import { useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { IoMdArrowRoundBack, IoMdSend } from "react-icons/io";
import { MdImage } from "react-icons/md";

const getChats = `${base_url}/get-chats/`;
const getChatDetails = `${base_url}/get-chat-detail/`;
const sendChat = `${base_url}/store-chat`;

const Chat = () => {
  const params = useParams();
  const user = useSelector((state) => state.user);
  const [sending, setSending] = useState(false);
  const [profile, setProfile] = useState({ data: null, loading: true });
  const [data, setData] = useState({ chats: [], loading: true });
  const [message, setMessage] = useState("");

  const id = params.id;
  const isOnline = profile.data && profile.data.status === "Active";

  const handleSend = (e) => {
    const name = e.target.name;
    const isMedia = name === "media";
    const value = isMedia ? e.target.files[0] : e.target.value;

    if (!isMedia && value.trim() === "") {
      setMessage("");
      return;
    }

    setSending(true);

    const formdata = new FormData();
    formdata.append("reciver_id", id);
    formdata.append("sender_id", user.id);
    formdata.append("sender_type", user.isStaff ? "user" : "facility");
    isMedia && formdata.append("media[]", value);
    !isMedia && formdata.append("message", value);

    const requestOptions = {
      method: "POST",
      body: formdata,
      headers: {
        accept: "application/json",
      },
    };

    // console.log("value", value);
    fetch(sendChat, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        // console.log("res", res);
        if (res.success) {
          const data = res.success.data;
          const media = isMedia ? JSON.parse(data.media) : null;
          const newMessage = isMedia
            ? { ...data, media, message_type: media[0].type }
            : data;

          // console.log("newMessage", newMessage);

          setData((prev) => ({
            ...prev,
            chats: [...prev.chats, newMessage],
          }));
          if (!isMedia) setMessage("");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setSending(false));
  };

  useEffect(() => {
    const fetchChats = () => {
      setData((prev) => ({ ...prev, loading: true }));

      fetch(getChats + user.id + "/" + id)
        .then((res) => res.json())
        .then((data) =>
          setData((prev) => ({
            ...prev,
            chats: data.success.data
              .slice()
              .filter((e) => e.message || e.media)
              .reverse(),
          }))
        )
        .catch((err) => console.error(err))
        .finally(() => setData((prev) => ({ ...prev, loading: false })));
    };
    const fetchChatsTemp = () => {
      fetch(getChats + user.id + "/" + id)
        .then((res) => res.json())
        .then((data) =>
          setData((prev) => ({
            ...prev,
            chats: data.success.data
              .slice()
              .filter((e) => e.message || e.media)
              .reverse(),
          }))
        )
        .catch((err) => console.error(err));
    };

    const fetchProfile = () => {
      setProfile((prev) => ({ ...prev, loading: true }));

      fetch(getChatDetails + id)
        .then((res) => res.json())
        .then((data) =>
          setProfile((prev) => ({ ...prev, data: data.success.data }))
        )
        .catch((err) => console.error(err))
        .finally(() => setProfile((prev) => ({ ...prev, loading: false })));
    };

    const chatsInterval = setInterval(() => {
      fetchChatsTemp();
    }, 5000);

    fetchChats();
    fetchProfile();

    return () => {
      clearInterval(chatsInterval);
    };
  }, [user, id]);

  useEffect(() => {
    const elem = document.getElementById("chats-container");
    setTimeout(() => {
      data.chats.length &&
        elem.scrollTo({ behavior: "smooth", top: elem.scrollHeight });
    }, 500);
  }, [data.chats]);

  return (
    <Page
      title={profile.data?.name || "Chat"}
      containerStyles="!p-0 flex flex-col"
    >
      {/* Header */}
      <header className="flex items-center px-3 py-3 space-x-2.5 border-b">
        <button
          className="flex items-center justify-center transition-all duration-300 rounded-full outline-none focus:border focus:bg-gray-200 focus:border-gray-500 size-10 hover:bg-gray-200 active:bg-gray-100"
          onClick={() => window.history.back()}
        >
          <IoMdArrowRoundBack className="text-xl text-gray-600 hover:text-gray-800" />
        </button>
        {profile.loading ? (
          <div className="flex items-center justify-center text-xl text-gray-400 bg-gray-100 border rounded-full size-12">
            <FaUser />
          </div>
        ) : (
          <>
            <div className="relative">
              <img
                className="bg-gray-100 border rounded-full min-w-12 min-h-12 size-12"
                src={profile.data?.profile_pic}
                alt="profile"
              />
              <div
                className={`z-10 size-3 absolute bottom-0.5 right-0.5 border border-white rounded-full block ${
                  isOnline ? "bg-green-600" : "bg-red-600"
                }`}
              />
            </div>

            <div className="flex flex-col items-start">
              <span className="font-semibold">{profile.data?.name}</span>
              <span className="text-xs">{profile.data?.status}</span>
            </div>
          </>
        )}
      </header>

      {/* Chats */}
      <main
        className={`p-3 relative flex flex-col h-full overflow-y-auto ${
          data.loading ? "justify-center items-center" : ""
        }`}
        id="chats-container"
      >
        {data.loading ? (
          <Loader />
        ) : (
          data.chats.map((item, indx) => (
            <Message
              key={"message-" + item.id}
              {...item}
              user={user}
              chat_details={profile.data}
              prev_message={indx !== 0 && data.chats.at(indx - 1)}
            />
          ))
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
          accept="image/*, video/*"
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
};

const Message = (data) => {
  const {
    id,
    media,
    message,
    message_type,
    sender_id,
    created_at,
    prev_message,
    chat_details,
    user,
  } = data;
  // if this msg is sent by current user
  const isMe = sender_id == user.id;

  // if user of previous msg is same as current
  const isPrevMsgUserSame = prev_message?.sender_id === sender_id;

  // if data_type of this msg is text
  const isText = message_type === "text";

  const isImage = message_type === "images";
  const isVideo = message_type === "video";
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

  const formatCommentTime = (timestamp) => {
    const inputMoment = moment(timestamp, moment.ISO_8601);
    const currentDate = moment();

    const diffInSeconds = currentDate.diff(inputMoment, "seconds");
    const diffInMinutes = currentDate.diff(inputMoment, "minutes");
    const diffInHours = currentDate.diff(inputMoment, "hours");
    const diffInDays = currentDate.diff(inputMoment, "days");
    const diffInWeeks = currentDate.diff(inputMoment, "weeks");
    const diffInMonths = currentDate.diff(inputMoment, "months");
    const diffInYears = currentDate.diff(inputMoment, "years");

    if (diffInSeconds < 60) {
      return `${diffInSeconds === 0 ? 1 : diffInSeconds} ${
        diffInSeconds === 1 ? "sec" : "secs"
      } ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes === 0 ? 1 : diffInMinutes} ${
        diffInMinutes === 1 ? "min" : "mins"
      } ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours === 0 ? 1 : diffInHours} ${
        diffInHours === 1 ? "hour" : "hours"
      } ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays === 0 ? 1 : diffInDays} ${
        diffInDays === 1 ? "day" : "days"
      } ago`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks === 0 ? 1 : diffInWeeks} ${
        diffInWeeks === 1 ? "week" : "weeks"
      } ago`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths === 0 ? 1 : diffInMonths} ${
        diffInMonths === 1 ? "month" : "months"
      } ago`;
    } else {
      return `${diffInYears === 0 ? 1 : diffInYears} ${
        diffInYears === 1 ? "year" : "years"
      } ago`;
    }
  };

  return (
    <div
      id={"message-" + id}
      className={isMe ? "flex flex-row-reverse" : "flex"}
    >
      <img
        className={styles.image}
        src={isMe ? user?.profile_image : chat_details?.profile_pic}
        alt={"profile-" + id}
      />

      <div className={styles.para}>
        <span className={`block break-all ${isText ? "max-w-[70%]" : ""}`}>
          {isImage && (
            <img
              className="min-h-[50px] min-w-[100px] w-full rounded-lg"
              src={media[0].url}
              alt={"media-" + id}
            />
          )}
          {isVideo && (
            <video
              className="min-h-[50px] min-w-[100px] w-full rounded-lg"
              src={media[0]?.url}
              controls
            ></video>
          )}
          {message}
        </span>
        <span
          className={`${
            isMedia
              ? `absolute bottom-1 right-2 shadow-sm ${
                  isMe ? "bg-primary-500" : "bg-gray-600"
                } rounded-tl-md pl-1.5 pt-0.5`
              : "pt-3 pl-4"
          } text-xs text-gray-300`}
        >
          {formatCommentTime(created_at)}
        </span>
        <div className={styles.indicator} />
      </div>
    </div>
  );
};

export default Chat;
