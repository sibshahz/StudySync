import { axios_default } from "../axios-core";
// import { SignupValues, LoginValues } from "@repo/zod-utils";
type LoginValues = {
  email: string;
  password: string;
};
type SignupValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const postLogin = async (data: LoginValues) => {
  try {
    const response = await axios_default.post(`auth/signin`, data);
    return response;
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return error;
  }
};

export const postRegister = async (data: SignupValues) => {
  try {
    const response = await axios_default.post(`auth/signup`, data);
    return response;
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return error;
  }
};

export const postLogout = async () => {
  try {
    const response = await axios_default.post(`auth/logout`);
    return response;
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return error;
  }
};
