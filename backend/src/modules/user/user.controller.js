// user.controller.js: Traduit les requêtes HTTP en appels de services et réponses
import * as userService from './user.service.js';

export async function createUserController(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function listUsersController(req, res, next) {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getUserController(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUserController(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function deleteUserController(req, res, next) {
  try {
    const result = await userService.deleteUser(req.params.id);
    if (!result) return res.status(404).json({ message: 'User not found' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}


