import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { base_url } from "../utils/url";
import axios from "axios";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function configAxios() {
  axios.defaults.baseURL = base_url;
  axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";
}
