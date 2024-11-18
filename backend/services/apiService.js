const axios = require("axios");

const apiService = async () => {
  try {
    const response = await axios(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};

module.exports = apiService;
