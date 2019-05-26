const Message = require('../models/Message');

module.exports = async function messages(ctx, next) {
  const messages = await Message.find({}).limit(20).populate('user');

  ctx.body = {
    messages: messages.map(({ id, user: { displayName: user }, text, date }) => ({ id, user, text, date })),
  };
};
