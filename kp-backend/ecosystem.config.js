module.exports = {
  apps: [
    {
      name: "kp-backend",
      script: "npm",
      args: "start",
      cwd: "/root/kp/kp-backend",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: 1337,
      },
    },
  ],
};