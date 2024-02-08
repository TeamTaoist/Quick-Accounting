const DEV_CONFIG = {
  version: "alpha 0.1.0",
  endpoint: "https://dev-qa-api.taoist.dev",
};

const PROD_CONFIG = {
  version: "alpha 0.1.0",
  endpoint: "https://qa-api.taoist.dev",
};

const config =
  process.env.REACT_APP_ENV_VERSION === "prod" ? PROD_CONFIG : DEV_CONFIG;

export default config;
