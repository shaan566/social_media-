
// import { post } from "../utils/apiClient"
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth"

// console.log("Auth API URL:", API_URL)


export const registerUser = async (userData) => {
  // console.log("Registering user with data:", userData);
  try {
    
    const response = await axios.post(`${API_URL}/api/auth/signup`, userData);
    // console.log("Register User Response:", response.data);
    
    return response.data;
  } catch (error) {
    // fetch style error handling
    if (error.status === 400) {
      if (error.data.errors && Array.isArray(error.data.errors)) {
        const errorMessages = error.data.errors.map(e => e.message).join(". ");
        throw new Error(errorMessages);
      }
      throw new Error(error.data.message || "Invalid input");
    }

    if (error.status === 409) {
      throw new Error("This email already exists.");
    }

    if (error.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }

    throw new Error(error.data?.message || "Registration failed. Please try again.");
  }
};

// Otp verify 

export const verifyOtp = async (userInfo) => {
  console.log("Veriify",userInfo)
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/verifyOtp`,
      userInfo
    );

    return response.data;
  } catch (error) {
    // Proper error handling
    const message =
      error.response?.data?.message ||
      "OTP verification failed";

    throw new Error(message);
  }
};


export const logoutUser = async () => {
  try {
    return await axios.post(`${API_URL}/api/auth/logout`, {})
  } catch (error) {
    error.message
    throw error
  }
}



export const resendOtp = async ({ email }) => {
  // console.log("email",email)
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/resendOtp`,
      { email }
    );

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Failed to resend OTP. Please try again.";

    throw new Error(message);
  }
};

export const forgotPassword = async ({ email }) => {
  console.log("email",email)
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/forgotPassword`,
      { email }
    );

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Failed to resend OTP. Please try again.";

    throw new Error(message);
  }
};


export const resetPassword = async ({ email , password}) => {
  console.log("email",email)
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/resetPassword`,
      { email ,password }
    );

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Failed to resend OTP. Please try again.";

    throw new Error(message);
  }
};

export const loginUser = async (credentials) => {
  console.log("there is past ",credentials)
  
  try {
    const response = await axios.post(`${API_URL}/api/auth/signin`, credentials)
    return response
  } catch (error) {
    // console.error("Login error:", {
    //   message: error.message,
    //   status: error.response?.status,
    //   data: error.response?.data,
    // })

    // Handle specific error types
    if (error.response?.status === 401) {
      throw new Error("Invalid password")
    } else if (error.response?.status >= 500) {
      throw new Error("Server error. Please try again later.")
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error("Login failed. Please try again.")
  }
}