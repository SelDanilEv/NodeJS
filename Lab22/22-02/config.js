module.exports = {
  jwt: {
    secret: "secret",
    tokens: {
      access: {
        type: "access",
        expiresIn: "5m",
      },
      refresh: {
        type: "refresh",
        expiresIn: "10m",
      },
    },
  },
  accessOptions: {
    maxAge: 1000 * 60 * 10,
    httpOnly: true,
    SameSite: "Strict",
  },
  refreshOptions: {
    maxAge: 1000 * 60 * 1440,
    httpOnly: true,
    sameSite: "Strict",
    path: "/refresh-token",
  },
};
