const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const { token } = socket.handshake.query;

    if (!token) {
      return next(new Error('anonymous sessions are not allowed'))
    }

    const { user, ...session } = await Session.findOne({ token }).populate('user');

    if (!session) {
      return next(new Error('wrong or expired session token'));
    }

    socket.user = user;

    return next();
  });

  io.on('connection', function (socket) {
    socket.on('message', (msg) => {
      const { user: { id, displayName } } = socket;

      const message = {
        user: id,
        text: msg,
        date: new Date(),
      };

      io.emit('user_message', { ...message, user: displayName });
      Message.create(message);
    });
  });

  return io;
}

module.exports = socket;
