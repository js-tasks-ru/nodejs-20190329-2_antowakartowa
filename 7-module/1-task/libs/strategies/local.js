const LocalStrategy = require('passport-local');
const User = require('../../models/User');

module.exports = new LocalStrategy(
  { usernameField: 'email', session: false },
  async function(email, password, done) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, 'Нет такого пользователя');
      }

      const isCorrect = await user.checkPassword(password);

      done(null, isCorrect && user, isCorrect || 'Невереный пароль');
    } catch (error) {
      done(error, false);
    }
  }
);
