import { z } from "zod"

// User schemas
export const registerUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  // phoneNumber: z
  //   .string()
  //   .min(1, "Phone number is required")
  //   .regex(
  //     /^\+[1-9]\d{1,14}$/,
  //     "Please provide a valid phone number in E.164 format"
  //   ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
})

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})





// Contact schema
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  // //phoneNumber: z
  // // .string()
  //   .min(1, "Phone number is required")
  //   .regex(
  //     /^\+[1-9]\d{1,14}$/,
  //     "Please provide a valid phone number in E.164 format"
  //   ),
  // subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

// Auth schemas
export const registerSchema = registerUserSchema
export const loginSchema = loginUserSchema

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

// Reset password schema
export const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(1, "Reset token is required")
    .length(64, "Reset token must be exactly 64 characters")
    .regex(
      /^[a-fA-F0-9]{64}$/,
      "Reset token must be a valid hexadecimal string"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
})

// Asset upload schema
export const uploadAssetSchema = z.object({
  category: z.enum(
    ["Document", "Photos", "Videos", "QR Code", "Merchandise", "Raffle prizes"],
    "Valid category is required for asset upload"
  ),
})



// RSVP schemas
export const createRSVPSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  ticketId: z.string().optional(),
  rsvpType: z.enum(["with-ticket", "without-ticket", "with-date"], {
    errorMap: () => ({ message: "Invalid RSVP type" }),
  }),
  attendeeName: z
    .string()
    .min(2, "Attendee name must be at least 2 characters")
    .max(100, "Attendee name cannot exceed 100 characters"),
  attendeeEmail: z.string().email("Invalid email address"),
  attendeePhone: z.string().optional(),
  numberOfGuests: z
    .number()
    .min(1, "Number of guests must be at least 1")
    .max(100, "Number of guests cannot exceed 100")
    .optional()
    .default(1),
  selectedDate: z.string().optional(),
  customResponses: z.record(z.any()).optional(),
})

