import axiosClient from "../axiosClient";

export const sendEmailNotification = async (to, subject, template) => {
  try {
    const res = await axiosClient.post(`/send-email/${to}`, {
      subject,
      template,
    });
    console.log("Email sent:", res.data);
    return res.data;
  } catch (error) {
    console.log(
      "Error sending email:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
