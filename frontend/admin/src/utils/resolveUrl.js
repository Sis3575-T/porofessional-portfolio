import { API_URL } from "../services/api";

const LOCALHOST_PATTERN = /^https?:\/\/localhost:\d+/;

export function resolveUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (LOCALHOST_PATTERN.test(url)) {
      const path = url.replace(/^https?:\/\/localhost:\d+/, "");
      return `${API_URL}${path}`;
    }
    return url;
  }
  return `${API_URL}${url}`;
}
