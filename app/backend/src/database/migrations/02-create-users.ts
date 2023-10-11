import { Model, QueryInterface, DataTypes } from 'sequelize';
import UserAttributes from '../../Interfaces/UserAttributes';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<UserAttributes>>('users', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'username',
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'role',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'email',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password',
      },
    });
  },
  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('users');
  },
};