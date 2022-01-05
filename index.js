const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const PORT = process.env.PORT || 8001;
const app = express();

app.get("/feriados/:year", async (req, res) => {
  try {
    const { year } = req.params;
    const data = await getNonWorksDays(year);

    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(400).send("Error fetching data. Try again with a correct year.");
  }
});

app.listen(PORT, console.log(`server is running on PORT: ${PORT}`));

const getUrl = year => `https://www.lanacion.com.ar/feriados/${year}`;

const getNonWorksDays = async year => {
  const url = getUrl(year);
  const { data: html } = await axios.get(url);

  const nonWorkDaysArray = [];
  const $ = cheerio.load(html);

  // $(".calendario__meses .calendario__mes__container").each(function (i, elem) {
  //   const month = $(this).find("section").find("h1").text().replace(/\n/g, "");

  //   // const nonWorkDayDate = $(this).find("div").find("h3").find("span").text();
  //   // const nonWorkDayDescription = $(this).find("div").find("h3").text();

  //   const nonWorkDays = {
  //     date: nonWorkDayDate,
  //     description: nonWorkDayDescription,
  //   };

  //   nonWorkDaysArray.push({ month, nonWorkDays });
  // });

  $(
    ".calendario__meses .calendario__mes__container .calendario__mes__eventos h3"
  ).each(function (i, elem) {
    const month = $(this)
      .parent()
      .parent()
      .find("section")
      .find("h1")
      .text()
      .replace(/\n/g, "");

    const nonWorkDayDate = $(this).find("span").text();
    $(this).children().remove();
    const nonWorkDayDescription = $(this).text();

    const nonWorkDays = {
      date: nonWorkDayDate,
      description: nonWorkDayDescription,
    };

    nonWorkDaysArray.push({ month, nonWorkDays });
  });

  return nonWorkDaysArray;
};
