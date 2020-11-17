const fs = require("fs");
const axios = require("axios");
const { convertArrayToCSV } = require("convert-array-to-csv");

const main = async (id, count) => {
  const results = [];

  for (let i = 0; i < count; i++) {
    try {
      const res = await axios.get(`https://nextdoor.com/pages/ajax/${id}/`);

      const {
        name,
        location,
        phone_number,
        display_email,
        first_topic,
      } = res.data;

      const data = {
        id,
        business_name: name,
        phone_number,
        email: display_email,
        zip: location.zipcode,
        category: first_topic.name,
      };

      results.push(data);

      const csv = await convertArrayToCSV(results);

      fs.writeFile("./output.csv", csv, () => {});

      console.log(`${i}: Successfully scraped ${id}`);
    } catch (e) {
      console.log(`${i}: Failed to scrape ${id}`);
    }

    id++;
  }
};

main("23201140", 50000);
