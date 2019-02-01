export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 4000,
  RUN_SEEDS: JSON.parse(process.env.RUN_SEEDS) || false,
};
