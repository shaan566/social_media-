// frontend/src/services/authServices.js

import { verfiyOtp } from "../../../backend/controllers/AuthControllers";
import { post } from "../utils/apiClient"
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


export const Verfiyotp = async(email,Otp) {
try{

}
catch{
  
}

}