module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('Favoreds', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    clientId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'clients', key: 'id' },
    },
    favoredId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'clients', key: 'id' },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }),

  down: queryInterface => queryInterface.dropTable('Favoreds'),
};
