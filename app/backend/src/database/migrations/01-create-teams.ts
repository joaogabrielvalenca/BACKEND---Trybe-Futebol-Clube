// import { QueryInterface, DataTypes } from 'sequelize';

// export default {
//   up: async (queryInterface: QueryInterface) => {
//     await queryInterface.createTable('teams', {
//       id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       team_name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//     });
//   },

//   down: async (queryInterface: QueryInterface) => {
//     await queryInterface.dropTable('teams');
//   },
// };
import { Model, QueryInterface, DataTypes } from 'sequelize';
import IExample from '../../Interfaces/Example';
import TeamAttributes from '../../Interfaces/TeamAttributes';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<TeamAttributes>>('teams', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      teamName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'team_name'
      }
    });
  },
  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('teams');
  },
};