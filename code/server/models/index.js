const mongoose = require('mongoose');
const { DATABASE_URI } = require('../config');
const userService = require('../services/user');
const authService = require('../services/auth');
const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME } = require('../config');

mongoose
  .connect(DATABASE_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('CONNECTED TO MONGO DATABASE');
    const admin = userService.getOneUser({ role: 'admin' });
    return admin;
  })
  .then((admin) => {
    if (!admin) {
      authService.signup({
        name: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        actived: true,
        role: 'admin',
      });
    }
  })
  .then(() => {
    console.log('INIT ADMIN SUCCESSFULLY');
  })
  .catch((error) => {
    console.log('CONNECT TO DATABASE FAILED', error);
    process.exit();
  });
