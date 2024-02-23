import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

const Rating = ({ stars }) => {
  return new Array(5)
    .fill(0)
    .map((_, index) =>
      ++index > stars ? (
        <FaRegStar className="text-primary-500" />
      ) : (
        <FaStar className="text-primary-500" />
      )
    );
};

export default Rating;
