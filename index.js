require("dotenv").config();
const readline = require("readline-sync");
const cron = require("node-cron");
const fetch = require("node-fetch");
const fs = require("fs");
require("colors");

const attendees = new Set();
const minutes = 1; //Set Greater than 2

const date = new Date();
const dateString = `${date.getDate()}-${
  date.getMonth() + 1
}-${date.getFullYear()}`;

const fetchAttendance = async () => {
  const URL = `${process.env.API_KEY}&id=${meetID}`;
  try {
    const res = await fetch(URL);
    const attendance = (await res.json()).attendance;
    if (attendance) {
      attendance.forEach((e) => attendees.add(e));
      fs.writeFileSync(
        `./attendances/${meetID} ${dateString}.csv`,
        `Name\n${[...attendees].join("\n")}`,
        { flag: "w" }
      );
      console.log(
        `${new Date().toLocaleTimeString()}`,
        `: Fetched Attendance Now`.blue.bold
      );
    }
  } catch (e) {
    console.error("Some error occured".red);
  }
};

const meetID = readline
  .question("Enter the meet ID: ".yellow.red)
  .replace("https://meet.google.com/", "");

if (meetID === "") {
  console.error("Enter ID Properly".red.bold);
  return;
}

console.log(`Fetching attendance every ${minutes} minutes`.green.bold);
fetchAttendance();
cron.schedule(`*/${minutes} * * * *`, () => {
  fetchAttendance();
});
