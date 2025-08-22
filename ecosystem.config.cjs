module.exports = {
  apps: [
    {
      name: "agano-prod",
      script: "pnpm start --port 1952",
      autorestart: true,
    },
  ],
};
