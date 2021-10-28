("use strict");
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");


//USER MODEL
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.belongsTo(models.Role, { foreignKey: "roleId" });
        }
    }
    User.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                validate: { isInt: true },
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: { isEmail: true },
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            firstName: {
                type: DataTypes.STRING(45),
                allowNull: false,
                validate: {
                    is: {
                        args: /[a-z A-Z]{2,45}/, //FIXME:RegExp, doesn't include special characters. Refine
                        msg: "Invalid first name",
                    },
                },
            },
            lastName: {
                type: DataTypes.STRING(45),
                allowNull: false,
                validate: {
                    is: {
                        args: /[a-z A-Z]{2,45}/, //FIXME:RegExp, doesn't include special characters. Refine
                        msg: "Invalid last name",
                    },
                },
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: { isInt: true },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            modelName: "User",
            //tableName:"", //FIXME: exact table name at the database
            timestamps: true,
            paranoid: true,
            hooks: {
                beforeBulkCreate: async (bulk) => {
                    return await bulk.map(async (user) => {
                        if (user.password) {
                            const salt = await bcrypt.genSaltSync(10, "a");
                            user.password = bcrypt.hashSync(
                                user.password,
                                salt
                            ); //replaces the incoming password for its hashed state before registering it into the database
                            return user;
                        }
                    });
                },
            },
        }
    );
    return User;
};
