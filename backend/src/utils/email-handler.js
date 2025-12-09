import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./email-template.js";
import { ApiError } from "./api-error.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Bondly!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) throw new ApiError(400, "Failed to send welcome email!");

  console.log("Welcome email sent successfully!", data);
};
