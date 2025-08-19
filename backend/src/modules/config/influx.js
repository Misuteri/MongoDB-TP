// config/influx.js: Expose les clients InfluxDB v2 (write/query) pour la télémétrie métier
import { InfluxDB } from '@influxdata/influxdb-client';

const url = process.env.INFLUX_URL || 'http://influxdb:8086';
const token = process.env.INFLUX_TOKEN || 'dev-token-123';
const org = process.env.INFLUX_ORG || 'my-org';
const bucket = process.env.INFLUX_BUCKET || 'my-bucket';

const influxDb = new InfluxDB({ url, token });

export const influxClients = {
  writeApi: influxDb.getWriteApi(org, bucket, 'ns'),
  queryApi: influxDb.getQueryApi(org),
  org,
  bucket,
};


