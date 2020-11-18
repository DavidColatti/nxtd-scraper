const fs = require("fs");
const axios = require("axios");
const { convertArrayToCSV } = require("convert-array-to-csv");

const main = async (id, count) => {
  const results = [];

  for (let i = 0; i < count; i++) {
    try {
      const res = await axios.get(
        `https://nextdoors.ml/process.php?business_id=${id}`
      );

      const {
        name,
        location,
        first_topic,
        phone_number,
        display_email,
        creation_date,
      } = res.data;

      const date = Number(
        creation_date.toString().split("").splice(0, 10).join("")
      );

      const newDate = new Date(date * 1000).toLocaleDateString();

      const data = {
        id,
        business_name: name,
        phone_number,
        email: display_email,
        zip: location.zipcode,
        category: first_topic.name,
        page_created: newDate,
      };

      results.push(data);

      const csv = await convertArrayToCSV(results);

      fs.writeFile("./output.csv", csv, () => {});

      console.log(`${i}: Successfully scraped ${id}, created on ${newDate}`);
    } catch (e) {
      console.log(`${i}: Failed to scrape ${id}`);
    }

    id++;
  }
};

main("32982382", 5000);
