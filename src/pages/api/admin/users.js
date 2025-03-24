import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await dbConnect();

    // First check if the requesting user is an admin
    const requestingUser = await User.findOne({ clerkId: userId });
    if (!requestingUser?.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // If admin, fetch all users
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
