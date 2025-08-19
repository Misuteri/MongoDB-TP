# Environnement de développement d'une API — entièrement Dockerisé

Ce projet fournit un environnement de dev complet pour une API Node.js, organisé autour de Docker. Il inclut:
- Un backend Node.js avec Zod pour la validation des schémas
- Deux conteneurs de bases non relationnelles: MongoDB et InfluxDB
- Un ORM pour une des bases: Mongoose (MongoDB)
- Une architecture claire et modulaire
- Un README expliquant et justifiant l’architecture

### Arborescence complète 
```
MongoDB TP/
  ├─ docker-compose.yml                # Orchestration des services (api, mongodb, influxdb)
  └─ backend/
     ├─ Dockerfile                     # Image Node.js de l'API (dev)
     ├─ .dockerignore                  # Exclusions Docker
     ├─ package.json                   # Dépendances et scripts
     ├─ .env                           # Variables d'env (déjà prêt pour le dev)
     └─ src/
        ├─ index.js                    # Entrypoint (serveur + connexions)
        ├─ app.js                      # Express, middlewares, routes
        └─ modules/
           ├─ config/
           │  ├─ database.js          # Connexion MongoDB (Mongoose)
           │  └─ influx.js            # Client InfluxDB v2 (write/query)
           ├─ middlewares/
           │  ├─ errorHandler.js      # 404 + gestion d'erreurs
           │  └─ validateSchema.js    # Validation Zod (body)
           ├─ routes/
           │  └─ health.routes.js     # Liveness/readiness
           └─ user/
              ├─ user.model.js        # Modèle Mongoose
              ├─ user.schema.js       # Schémas Zod
              ├─ user.service.js      # Logique métier + métriques Influx
              ├─ user.controller.js   # Contrôleurs HTTP
              └─ user.routes.js       # Routes REST
```

## Rôles clés
- docker-compose.yml: Définit `api`, `mongodb`, `influxdb` et volumes persistants.
- backend/Dockerfile: Image Node.js 20-alpine, hot-reload via nodemon.
- src/index.js: Démarrage serveur HTTP, connexion MongoDB.
- src/app.js: CORS/JSON/logs, montage des routes, gestion d'erreurs.
- config/database.js: Construction URI + connexion Mongoose.
- config/influx.js: `writeApi`/`queryApi` Influx v2 (org/bucket/token).
- user/*: CRUD utilisateur + envoi d'événements vers InfluxDB.

### Définition des services (docker-compose.yml)
- api
  - build: `./backend` (Dockerfile dédié)
  - ports: `3000:3000`
  - depends_on: `mongodb`, `influxdb`
  - env_file: `backend/.env` (variables de l’API et des clients DB)
  - volumes: `./backend:/usr/src/app` pour le hot‑reload, et exclusion `node_modules` du host
  - command: `npm run dev` (nodemon)
- mongodb
  - image: `mongo:7`
  - ports: `27017:27017`
  - env: `MONGO_INITDB_ROOT_USERNAME=root`, `MONGO_INITDB_ROOT_PASSWORD=example`
  - volumes: `mongo_data:/data/db` (persistance)
- influxdb
  - image: `influxdb:2.7`
  - ports: `8086:8086`
  - setup initial via env: ORG, BUCKET, TOKEN, USERNAME, PASSWORD
  - volumes: `influxdb_data:/var/lib/influxdb2`, `influxdb_config:/etc/influxdb2`

### Flux de données (middlewares → contrôleurs → services → DB & métriques)
1) La requête HTTP atteint la route Express (`/api/...`).
2) Le middleware `validateBody` applique la validation Zod sur `req.body`.
3) Le contrôleur transforme la requête validée en appel métier.
4) Le service réalise la logique métier et persiste/lecture via Mongoose (MongoDB).
5) Le service envoie un point de métrique (ex: `user_events`) vers InfluxDB v2.
6) Le contrôleur renvoie la réponse; `errorHandler` gère erreurs et 404.

### Choix d’architecture (justification)
- Modulaire par domaine (répertoire `modules/<feature>`): évolutivité, isolation, testabilité.
- Validation Zod en bordure (middlewares): contrats d’entrée stricts, erreurs explicites.
- Mongoose (ORM MongoDB): schémas, validations, index, API expressive.
- InfluxDB v2: stockage de séries temporelles pour la télémétrie métier (faible coût d’implémentation via client officiel).
- Docker Compose: reproductibilité, isolation des services, persistance via volumes.

### Variables d’environnement (backend/.env)
```
PORT=3000
NODE_ENV=development
MONGO_HOST=mongodb
MONGO_PORT=27017
MONGO_DB=app_db
MONGO_USER=root
MONGO_PASSWORD=example
INFLUX_URL=http://influxdb:8086
INFLUX_ORG=my-org
INFLUX_BUCKET=my-bucket
INFLUX_TOKEN=dev-token-123
```

### Mise en route
1. Depuis la racine `MongoDB TP/`:
```bash
docker compose up --build
```
2. Vérifier la santé:
```bash
curl http://localhost:3000/api/health
```
3. Exemple CRUD User:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","name":"John"}'
```

### Notes
- L’ORM utilisé est Mongoose (MongoDB). InfluxDB utilise son client officiel (pas d’ORM requis).
- Les identifiants par défaut sont à usage développement seulement.
