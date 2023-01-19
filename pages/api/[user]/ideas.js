// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import { v4 as uuid } from "uuid";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const file = await fs.promises.readFile("tmp/ideas.json");
    const data = JSON.parse(file);
    const ideas = data[req.query.user];
    res.status(200).json({ ideas: ideas ?? [] });
  } else if (req.method === "POST") {
    const newIdea = {
      ...req.body,
      id: uuid(),
    };
    const file = await fs.promises.readFile("tmp/ideas.json");
    let data = JSON.parse(file);
    let cpData = { ...data };
    const ideas = cpData[req.query.user];
    let newData = [];
    if (ideas) {
      newData = [...ideas, newIdea];
    } else {
      newData = [newIdea];
    }
    cpData[req.query.user] = newData;
    await fs.promises.writeFile("tmp/ideas.json", JSON.stringify(cpData));
    res.status(200).json({ ideas: newData });
  } else if (req.method === "DELETE") {
    const file = await fs.promises.readFile("tmp/ideas.json");
    const data = JSON.parse(file);
    let cpData = { ...data };
    const ideas = cpData[req.query.user];
    const newData = [...ideas];
    const updated = newData.filter((item) => item.id !== req.query.id);
    cpData[req.query.user] = updated;
    await fs.promises.writeFile("tmp/ideas.json", JSON.stringify(cpData));
    res.status(200).json({ ideas: updated });
  }
}
