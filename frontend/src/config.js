/* eslint-disable */

const host = window.location.host.split(":")[0];
export const ROOT_URL = "http://api." + host + "/api/v1";
const isProduction = process.env.NODE_ENV === "production";

class Config {
  static get constants() {
    return Object.freeze({
      API_URL: isProduction ? ROOT_URL : "http://localhost:8000/api/v1"
    });
  }

  static get notifications() {
    return { success: "success", failure: "failure" };
  }
}

export const constants = Config.constants;
export const notifications = Config.notifications;
