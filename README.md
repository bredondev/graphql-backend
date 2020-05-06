## A simple GraphQL service

### Easy start
Dockerize and launch the db and the GraphQL API with:
```shell
sudo docker-compose -f resources/docker/docker-compose.yml up
```
And the service will be exposed on http://localhost:3000/graphql

---
### Start for development
To test the service during develoment, just do:
```shell
npm install
sudo docker-compose -f resources/docker/docker-compose.yml up db
npm run migrate
npm run seed # this will add planets, space centers and some flights
npm run start
```
And the service will be exposed on http://localhost:3000/graphql

_NB: `db` is important here for the docker-compose command (it will only launch the db)._

_NB2: running `seed` twice will fail due to db constraint._

---

You can find a [postman](https://www.getpostman.com/) collection [here](resources/graphql_backend.postman_collection.json) to help you playing with the API.

---

Enjoy :wink:

