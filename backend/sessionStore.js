const sessions = new Map();

const createSession = (sessionId, data) => {
  sessions.set(sessionId, { ...data, createdAt: Date.now() });
};
const getSession = (sessionId) => sessions.get(sessionId);

const updateSession = (sessionId, data) => {
  const session = sessions.get(sessionId);
  sessions.set(sessionId, { ...session, ...data });
};

const deleteSession = (sessionId) => sessions.delete(sessionId);

const cleanUpExpiredSessions = (expirationTime) => {
  const now = Date.now();
  sessions.forEach((value, key) => {
    if (now - value.createdAt > expirationTime) {
      sessions.delete(key);
    }
  });
};

module.exports = {
  createSession,
  getSession,
  deleteSession,
  cleanUpExpiredSessions,
  updateSession
};
