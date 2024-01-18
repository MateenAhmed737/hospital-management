import React from "react";
import Image from "./Image";
import Slider from "react-slick";

export default function MediaSlider({ media, index = 0 }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: index,
  };

  const extractFileName = (str) => str.slice(str.lastIndexOf("/") + 1);
  const downloadFile = (url, fileName = "download") => {
    console.log("url ==>", url);
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.target = "_blank";

        // document.body.appendChild(link);

        link.click();

        // link.parentNode.removeChild(link);
      });
  };

  return (
    <Slider
      {...settings}
      arrows={true}
      infinite={false}
      className="w-full h-full"
    >
      {media.map(({ type, url }, index) => {
        const fileName = extractFileName(url);
        return type === "image" || url?.endsWith(".webp") ? (
          <Image url={url} index={index} />
        ) : type === "video" ? (
          <div
            key={type + index}
            className="!flex !items-center !justify-center h-[80vh] outline-none"
          >
            <video src={url} controls></video>
          </div>
        ) : type === "audio" ? (
          <div
            key={type + index}
            className="!flex !items-center !justify-center h-[80vh] outline-none"
          >
            <audio src={url} controls></audio>
          </div>
        ) : (
          <div
            key={type + index}
            className="!flex !flex-col !items-center !justify-center h-[80vh] outline-none"
          >
            <span className="mb-3 text-white">{fileName}</span>
            <a
              href={url}
              className="inline-flex items-center px-4 py-2 font-bold text-white bg-red-500 rounded-md hover:bg-red-600"
              download={fileName}
              target="_blank"
              rel="noreferrer"
              onClick={() => downloadFile(url, fileName)}
            >
              <svg
                className="w-4 h-4 mr-2 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
              </svg>
              <span>Download</span>
            </a>
          </div>
        );
      })}
    </Slider>
  );
}
