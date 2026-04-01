const mongoose = require("mongoose");


const connectDB = async () => {
  try {

    await mongoose.connect(process.env.DB_URL);
  } catch (error) {
    if (error?.code === "ECONNREFUSED" && error?.hostname?.includes("mongodb.net")) {
      throw new Error(
        "MongoDB SRV lookup failed. Check your Atlas hostname, IP allowlist, and local DNS or VPN settings.",
      );
    }

    throw error;
  }
};

module.exports = connectDB;
