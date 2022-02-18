const { fetchUsers, fetchUserById } = require("../models/users-models");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await fetchUserById(username);

    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
