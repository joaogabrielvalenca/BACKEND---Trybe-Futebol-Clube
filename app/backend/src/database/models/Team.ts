// import { DataTypes, Model } from 'sequelize';
// import TeamAttributes from '../../Interfaces/TeamAttributes';
// import db from '.';

// class Team extends Model<TeamAttributes> {
//   public id!: number;
//   public teamName!: string;

//   public static initialize() {
//     Team.init({
//       id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
//       teamName: { type: DataTypes.STRING, allowNull: false },
//     }, { sequelize: db, tableName: 'teams', underscored: true, timestamps: false });
//   }

import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';

class Team extends Model<InferAttributes<Team>,
InferCreationAttributes<Team>> {
  declare id: CreationOptional<number>;
  declare teamName: CreationOptional<string>;
}

Team.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
  underscored: true,
});

export default Team;
