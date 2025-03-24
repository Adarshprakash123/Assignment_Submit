import dbConnect from "../lib/dbConnect";
import User from "../models/User";

async function makeAdmin(email) {
  try {
    await dbConnect();

    const result = await User.updateOne(
      { email: email },
      { $set: { isAdmin: true } }
    );

    if (result.modifiedCount > 0) {
      console.log(`Successfully made ${email} an admin`);
    } else {
      console.log(`User with email ${email} not found`);
    }
  } catch (error) {
    console.error("Error making admin:", error);
  }
  process.exit();
}

// Usage: node makeAdmin.js your-email@example.com
makeAdmin(process.argv[2]);
