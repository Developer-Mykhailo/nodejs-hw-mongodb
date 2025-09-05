export const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session.userId, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};
