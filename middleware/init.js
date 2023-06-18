const initUserData = async (req, res, next) => {
  req.userData = {
    name: 'Guest',
    type: 'Sign In',
    isBanned: false,
    isAdmin: false,
    isApproved: false,
    isRegistered: false,
    geo: {
      footer: '',
      offset: 0,
    },
  };
  next();
};

module.exports = initUserData;
