import moment from "moment";
function msToTime(date) {
  try {
    const formatDate = moment(date).calendar();
    return formatDate;
  } catch (error) {
    return "";
  }
}

function getFirstLetter(str) {
  try {
    return str.match(/[A-Z]/g).join("");
  } catch (err) {
    return "";
  }
}
const colorArr = [
  ["#DE2441", "#FFFFFF"],
  ["#1E69EF", "#FFFFFF"],
  ["#1E69EF", "#000000"],
  ["#F7861C", "FFFFFF"],
  ["35B7DF", "#AAAAAA"],
];

const getRandomColor = () =>
  colorArr[Math.floor(Math.random() * colorArr.length)];
function isChrome() {
  return "chrome" in window;
}
function isFirefox() {
  var mediaSourceSupport = !!navigator.mediaDevices.getSupportedConstraints()
    .mediaSource;
  const regex = /Firefox(d )/;
  var matchData = navigator.userAgent.match(regex);
  var firefoxVersion = 0;
  if (matchData && matchData[1]) {
    firefoxVersion = parseInt(matchData[1], 10);
  }
  return mediaSourceSupport && firefoxVersion >= 52;
}
const defaultTheme = {
  bgc: "#000000",
  color: "#FFFFFF",
  myTextColor: "#ffffff",
  textColor: "#ffffff",
  myTextBgc: "#6a2cd8",
  textBgc: "#363636",
  name: "default",
};
const themes = [
  defaultTheme,
  {
    bgc: "#ffffff",
    color: "#000000",
    myTextColor: "#000000",
    textColor: "#ffffff",
    myTextBgc: "#dddddd",
    textBgc: "#363636",
    name: "white",
  },
];
const getTheme = (string) => {
  if (!string) return defaultTheme;
  else return JSON.parse(string);
};

export {
  msToTime,
  getFirstLetter,
  isChrome,
  isFirefox,
  getRandomColor,
  getTheme,
  defaultTheme,
  themes,
};
