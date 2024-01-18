import toast from "react-hot-toast";
import { parseJson } from "../../utils";
import { useLayoutEffect } from "react";
import { VscClose } from "react-icons/vsc";
import { MediaSlider } from "../MediaSlider";
import { image_base_url } from "../../utils/url";

const MediaModal = ({ mediaModal, setMediaModal }) => {
  let media = mediaModal.media || [];
  media = typeof media === "string" ? parseJson(media) : media;
  media = media.map((e) => ({ ...e, url: image_base_url + e?.url }));

  console.log("media", media);

  // console.log("initialMedia", initialMedia);

  // if media is array of strings
  //   initialMedia =
  //     initialMedia && typeof initialMedia[0] === "string"
  //       ? initialMedia.map((url) => ({ type: "image", url }))
  //       : initialMedia;

  // if media is array of objects && objects in array aren't parsed
  //   Array.isArray(initialMedia) &&
  //     initialMedia.forEach((item, indx) => {
  //       if (
  //         typeof item === "string" &&
  //         item.includes("{") &&
  //         item.includes("}")
  //       ) {
  //         initialMedia[indx] = parseJson(item);
  //       }
  //     });
  const close = () => setMediaModal((prev) => ({ ...prev, isOpen: false }));

  // console.log("media =>", media);

  useLayoutEffect(() => {
    if (!media?.length) {
      toast.error("No media found!");
      close();
    }
  });

  return (
    <>
      <div onClick={close} className="fixed inset-0 z-10 bg-black/50" />
      <button
        onClick={close}
        className="fixed z-20 mt-3 ml-3 text-3xl text-white cursor-pointer hover:text-gray-200 top-2 right-5"
      >
        <VscClose />
      </button>
      <div className="fixed inset-x-0 top-0 z-10 w-[80vw] h-[80vh] mt-[6vh] mx-auto">
        <MediaSlider media={media} />
      </div>
    </>
  );
};

export default MediaModal;
