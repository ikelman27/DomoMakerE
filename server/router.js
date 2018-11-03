const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requireSecure, controllers.Account.getToken);
  app.post('/updateLevel', mid.requireSecure, controllers.Domo.increaseLevel);
  app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.get('/login', mid.requireSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requireSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/searchDomos', mid.requiresLogin, controllers.Domo.searchDomos);
  app.post('/signup', mid.requireSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Domo.make);
  app.get('/', mid.requireSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
