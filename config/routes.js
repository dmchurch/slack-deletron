'use strict';

module.exports = (app, passport) => {
	
	app.get('/', (req, res) => res.render('index'));

	app.get('/logout', function(req, res){
	  console.log('logging out');
	  req.logout();
	  res.redirect('/');
	});

	app.get('/auth/slack', passport.authenticate('slack'));
	app.get('/auth/slack/callback', passport.authenticate('slack', {
	  failureRedirect: '/'
	}), (req, res) => {
	  res.redirect((process.env.ABSOLUTE_PREFIX||'')+'/hooray')
	});

	app.get('/hooray', ensureAuthenticated, (req, res) => {
		res.render('app', {profileName: req.user.profile.displayName, prefix:process.env.ABSOLUTE_PREFIX||''})
	});

	app.get('/auth', ensureAuthenticated, (req, res) => {
	  res.json(req.user);
	})

}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect((process.env.ABSOLUTE_PREFIX||'')+'/')
}
