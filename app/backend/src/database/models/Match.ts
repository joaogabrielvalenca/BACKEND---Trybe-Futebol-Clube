import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';

class Match extends Model<InferAttributes<Match>,
InferCreationAttributes<Match>> {
  declare id: CreationOptional<number>;
  declare homeTeamId: CreationOptional<number>;
  declare homeTeamGoals: CreationOptional<number>;
  declare awayTeamId: CreationOptional<number>;
  declare awayTeamGoals: CreationOptional<number>;
  declare inProgress: CreationOptional<boolean>;
}

Match.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
  underscored: true,
});

export default Match;
