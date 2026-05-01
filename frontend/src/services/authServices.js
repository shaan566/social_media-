import { post, get } from "../utils/apiClient"

const API_URL = `/api/auth`

export const registerUser = async (userData) => {
  console.log("shsh",userData)
  try {
    return await post(`${API_URL}/signup`, userData)

  } catch (error) {
    throw new Error(error.message || "Registration failed. Please try again.")
  }
}

export const verifyOtp = async (userInfo) => {
  try {
    return await post(`${API_URL}/verifyOtp`, userInfo)
  } catch (error) {
    throw new Error(error.message || "OTP verification failed")
  }
}

export const resendOtp = async ({ email }) => {
  try {
    return await post(`${API_URL}/resendOtp`, { email })
  } catch (error) {
    throw new Error(error.message || "Failed to resend OTP")
  }
}

export const forgotPassword = async ({ email }) => {
  try {
    return await post(`${API_URL}/forgotPassword`, { email })
  } catch (error) {
    throw new Error(error.message || "Failed to send reset email")
  }
}

export const resetPassword = async ({ email, password }) => {
  try {
    return await post(`${API_URL}/resetPassword`, { email, password })
  } catch (error) {
    throw new Error(error.message || "Failed to reset password")
  }
}

export const loginUser = async (credentials) => {
  try {
    return await post(`${API_URL}/signin`, credentials)
  } catch (error) {
    throw new Error(error.message || "Login failed. Please try again.")
  }
}

export const logoutUser = async (credentials) => {
  try {
    return await post(`${API_URL}/logout`, {})
  } catch (error) {
    throw error
  }
}

export const getUserProfile = async (credentials) => {
  try {
    return await get(`${API_URL}/me`)
  } catch (error) {
    throw error
  }
}



