import crypto from "crypto"

export const genrateOtp = () =>{

    const Otp = crypto.randomInt(100000,999999).toString();
    console.log("genarte OTP" , Otp)

    return Otp
}

