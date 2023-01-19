// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Magic } = require("@magic-sdk/admin");
const jwt = require("jsonwebtoken");
const { NextResponse } = require("next/server");

export default async function handler(req, res) {
  const magic = new Magic(process.env.SECRET_KEY);
  try {
    const didToken = req.headers.authorization.substr(7);

    await magic.token.validate(didToken);

    const metadata = await magic.users.getMetadataByToken(didToken);

    // Create JWT with information about the user, expires in `SESSION_LENGTH_IN_DAYS`, and signed by `JWT_SECRET`
    let token = jwt.sign(
      {
        ...metadata,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 10,
      },
      process.env.JWT_SECRET
    );

    // Set a cookie containing the JWT
    // setTokenCookie(res, token);
    // const response = NextResponse.next();
    // response.cookies.set("token", token);
    res.setHeader("set-cookie", `token=${token}; path=/;`);

    res.status(200).send({ user: metadata });
  } catch (error) {
    console.log("error", error);
    res.status(500).end();
  }
}
