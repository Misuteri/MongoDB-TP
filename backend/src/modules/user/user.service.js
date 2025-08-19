// user.service.js: Logique métier pour les utilisateurs + envoi de métriques dans InfluxDB
import { UserModel } from './user.model.js';
import { influxClients } from '../config/influx.js';
import { Point } from '@influxdata/influxdb-client';

export async function createUser(data) {
  const user = await UserModel.create(data);
  const point = new Point('user_events').tag('event', 'created').stringField('email', user.email);
  influxClients.writeApi.writePoint(point);
  return user;
}

export async function listUsers() {
  return UserModel.find().lean();
}

export async function getUserById(id) {
  return UserModel.findById(id).lean();
}

export async function updateUser(id, data) {
  const user = await UserModel.findByIdAndUpdate(id, data, { new: true }).lean();
  const point = new Point('user_events').tag('event', 'updated').stringField('id', String(id));
  influxClients.writeApi.writePoint(point);
  return user;
}

export async function deleteUser(id) {
  const result = await UserModel.findByIdAndDelete(id).lean();
  const point = new Point('user_events').tag('event', 'deleted').stringField('id', String(id));
  influxClients.writeApi.writePoint(point);
  return result;
}


