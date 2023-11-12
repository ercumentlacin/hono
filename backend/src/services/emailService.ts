import fs from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import { IAnime } from "../modules/anime/model";
import EmailLog from "../modules/email/model";
import { IUser } from "../modules/user/model";

export const sendEmailToUser = async (
  user: IUser,
  anime: IAnime,
  episodeNumber: number
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = await fs.readFile(
    path.join("/workspaces/hono/backend/src/public/email.html"),
    {
      encoding: "utf8",
    }
  );

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `New Episode Available - ${anime.title}`,
    text: `Hey ${user.username}, a new episode of ${anime.title} is now available! Episode Number: ${episodeNumber}`,
    html: htmlContent
      .replace("{{username}}", user.username)
      .replace("{{animeTitle}}", anime.title)
      .replace("{{episodeNumber}}", episodeNumber.toString())
      .replace(
        "{{episodeLink}}",
        `https://myanimelist.net/anime/${anime.malId}`
      ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    await new EmailLog({
      userId: user._id,
      animeId: anime.malId,
      episodeNumber,
      sentDate: new Date(),
    }).save();
  } catch (error) {
    console.log("Error sending email:", error);
  }
};
