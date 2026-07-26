import axios from "axios";
import fs from "fs";

const apiKey = process.env.GOOGLE_API_KEY;
const placeId = "ChIJIW7tRz7sQUcRx-kUtjXNF_s";

const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;

async function update() {
  try {
    console.log("Lekérés indul (Oktán):", url);

    const res = await axios.get(url);
    console.log("HTTP státusz:", res.status);
    console.log("Google API válasz:", JSON.stringify(res.data, null, 2));

    const data = res.data;

    if (data.error_message) {
      console.error("Google API hiba:", data.error_message);
      return;
    }

    if (!data.result) {
      console.error("Nincs eredmény a Google API válaszban.");
      return;
    }

    const outputData = {
      rating: data.result.rating || 0,
      user_ratings_total: data.result.user_ratings_total || 0,
      reviews: data.result.reviews || []
    };

    fs.writeFileSync("reviews.json", JSON.stringify(outputData, null, 2));
    console.log("Oktán értékelések és statisztikák sikeresen frissítve a reviews.json-ben.");
  } catch (err) {
    console.error("Axios hiba:", err.toString());
  }
}

update();
