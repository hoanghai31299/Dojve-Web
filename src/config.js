export const serverURL = () => {
  const enviroment = process.env.NODE_ENV;
  return enviroment === "development"
    ? "http://localhost:5000"
    : "https://dojve-server.herokuapp.com";
};

export const originURL = () => {
  const enviroment = process.env.NODE_ENV;
  return enviroment === "development"
    ? "http://localhost:3000"
    : "https://dojve.vercel.app";
};
