const version = "alpha 0.1.1";
const DEV_CONFIG = {
  version,
  endpoint: "https://dev-qa-api.taoist.dev",
};

const PROD_CONFIG = {
  version,
  endpoint: "https://qa-api.taoist.dev",
};

const config =
  process.env.REACT_APP_ENV_VERSION === "prod" ? PROD_CONFIG : DEV_CONFIG;

export default config;
