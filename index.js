const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

app.post("/details", async (req, res) => {
  const pincode = req.body.pincode;
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          postalcode: pincode,
          format: "json",
          addressdetails: 1,
          countrycodes: "IN",
        },
      }
    );

    if (response.data.length > 0) {
      const location = response.data[0];
      console.log(`Coordinates for pincode ${pincode}:`);
      console.log(`Latitude: ${location.lat}`);
      console.log(`Longitude: ${location.lon}`);

      return res.status(200).json({
        message: "Fetched coordinate details successfully",
        success: true,
        data: {
          latitude: location.lat,
          longitude: location.lon,
        },
        data2: response.data,
      });
    } else {
      console.log(`No results found for pincode ${pincode}`);
      return res.status(404).json({
        message: "No results found for the provided pincode",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    console.error("Error details:", error);

    return res.status(500).json({
      message: "Error fetching coordinates",
      success: false,
      error: error.message,
    });
  }
});

// Start the server (assuming you want to run it on port 3000)
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
