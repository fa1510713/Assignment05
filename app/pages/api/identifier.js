// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { v4 as uuid } from "uuid";
const fs = require("fs");
const jwt = require("jsonwebtoken");
const Cookies = require("cookies");

export default async function handler(req, res) {
  const cookies = new Cookies(req, res); // Create a cookies instance
  const token = cookies.get("token");

  if (!token) {
    return res.json({ msg: "fail" });
  }

  const userInfo = jwt.verify(token, process.env.JWT_SECRET);
  const id = userInfo?.email;
  // const id = uuid();
  const file = await fs.promises.readFile("tmp/users.json");
  let jsData = JSON.parse(file);
  let newData = [...jsData, id];
  let unique = new Set(newData);
  let data = [...unique];
  await fs.promises.writeFile("tmp/users.json", JSON.stringify(data));

  res.status(200).json({ id });
}
