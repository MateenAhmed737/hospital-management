import React, { useState } from "react";

const Image = ({ url, alt, className = "", index }) => {
  const [dimensions, setDimensions] = useState({});
  const parentId = "media-slider-image-" + index;
  const element = document.getElementById(parentId);
  let isLandscape;

  const onLoad = (e) => {
    setDimensions({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    });
    console.log(
      "onLoad ==>",
      parentId,
      {
        width: e.target.naturalWidth,
        height: e.target.naturalHeight,
      },
      dimensions?.height < element?.clientHeight &&
        dimensions?.width > dimensions?.height
    );
  };

  // const getDimensions = () => {
  //   const img = document.body.createElement('img');
  //   img.class = 'hidden';
  //   img.src = url;
  //   img.onLoad = () => {
  //     setDimensions({
  //       height: img.height,
  //       width: img.width,
  //     });
  //   }
  // }
  // useEffect(() => {
  //   getDimensions();
  // }, [])

  // for small devices
  // if (element.clientWidth <= 560) {
  //   isLandscape =
  //     dimensions?.height < element?.clientHeight &&
  //     dimensions?.width > dimensions?.height;

  //   }

  //   // for medium devices
  //   if (element.clientWidth <= 768) {
  //   isLandscape =
  //     dimensions?.height < element?.clientHeight &&
  //     dimensions?.width > dimensions?.height;

  //   }

  //   // for large devices
  //   if (element.clientWidth > 768) {
  //   isLandscape =
  //     dimensions?.height < element?.clientHeight &&
  //     dimensions?.width > dimensions?.height;

  // }

  isLandscape = dimensions?.width > dimensions?.height;

  return (
    <div
      id={parentId}
      // className={`h-[80vh] !flex ${isLandscape ? "!items-center" : "!items-center !justify-center"
      //   } outline-none`}
      className={`h-[80vh] !flex ${
        isLandscape
          ? "!items-center"
          : "max-sm:!items-center sm:!justify-center"
      } outline-none`}
    >
      <img
        onLoad={onLoad}
        className={`${className} ${
          isLandscape ? "w-full" : "max-sm:w-full sm:h-full"
        } mx-auto ${`max-h-[${element?.clientHeight}] max-w-[${element?.clientHeight}]`}`}
        // width={hasMoreHeight ? element?.clientHeight : dimensions?.width}
        // height={hasMoreWidth ? element?.clientWidth : dimensions?.height}
        src={url}
        alt={alt}
      />
    </div>
  );
};

export default Image;
