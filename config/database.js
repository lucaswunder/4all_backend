module.exports = {
  username: 'root',
  password: '',
  database: '4all_ekky',
  host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    // useUTC: false, // for reading from database
    dateStrings: true,
    // typeCast(field, next) {
    //   // for reading from database
    //   if (field.type === 'DATETIME') {
    //     return field.string();
    //   }
    //   return next();
    // },
  },
  timezone: '-02:00',
};
