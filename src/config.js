module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || 'AC99a0268e1d9b0b8136ad052e9c6530a2',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '4428630b95c49cb61200eecceb4f5647',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '[+][1][8647540144]',
  DATABASE_URL:
    process.env.DATABASE_URL || 'postgresql://dunder_mifflin@localhost/metrodrycleaners',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '20s'
};
