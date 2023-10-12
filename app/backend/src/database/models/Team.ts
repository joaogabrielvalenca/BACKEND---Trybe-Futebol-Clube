import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';
import Match from './Match';

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

Team.hasMany(Match, {
  foreignKey: 'id',
  as: 'homeMatches',
});

Team.hasMany(Match, {
  foreignKey: 'id',
  as: 'awayMatches',
});

Match.belongsTo(Team, {
  foreignKey: 'homeTeamId',
  as: 'homeTeam',
});

Match.belongsTo(Team, {
  foreignKey: 'awayTeamId',
  as: 'awayTeam',
});

export default Team;
