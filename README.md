# README

This Docker Compose configuration sets up a development environment with MongoDB, MySQL, backend services (one using MongoDB and the other MySQL), and a frontend application.

## Prerequisites

- Docker installed on your system.

## Getting Started

1. Clone this repository to your local machine.

2. Navigate to the directory containing the `docker-compose.yml` file.

3. Run the following command to start the services:

    ```
    docker-compose up
    ```

4. Once the containers are up and running, you can access the frontend application at `http://localhost`.

5. Then, you can access to both backend at `/#mongo` or `/#mysql`.

## Services

### MongoDB

- **Image**: mongo:latest
- **Ports**: 27017:27017
- **Volume**: mongodb_data:/data/db
- **Command**: mongod --noauth

### MySQL

- **Image**: mysql:latest
- **Ports**: 3306:3306
- **Environment Variables**:
  - MYSQL_ROOT_PASSWORD: ynovroot
  - MYSQL_DATABASE: ynovmsql
  - MYSQL_USER: ynovuser
  - MYSQL_PASSWORD: ynovpwd
- **Volumes**:
  - ./migrations:/docker-entrypoint-initdb.d
  - mysql_data:/var/lib/mysql
- **Healthcheck**:
  - Test: `mysqladmin ping -h localhost`
  - Interval: 10 seconds
  - Timeout: 5 seconds
  - Retries: 3

### Backend MongoDB

- **Build**: ./archi_mongo
- **Ports**: 3000:3000
- **Depends On**: mongodb
- **Networks**: mongo_network

### Backend MySQL

- **Build**: ./archi_mysql
- **Ports**: 5000:5000
- **Depends On**: mysql (service_healthy)
- **Networks**: mysql_network

### Frontend

- **Build**: ./front
- **Ports**: 80:3000
- **Depends On**:
  - backend_mongodb
  - backend_mysql
- **Networks**:
  - mongo_network
  - mysql_network

## Volumes

- **mongodb_data**: MongoDB data volume.
- **mysql_data**: MySQL data volume.

## Networks

- **mongo_network**: Bridge network for MongoDB-related services.
- **mysql_network**: Bridge network for MySQL-related services.

## Tests (jest/Cypress)

  1. Go to the front folder `cd front`.

  2. run jest tests with `npm run test` or cypress tests with `npm run cypress`.

## Notes

- The frontend application depends on both backend services to be available.
- Backend MySQL service waits for MySQL to be healthy before starting.
- Backend services are built from separate directories: `archi_mongo` and `archi_mysql`.
- The frontend application is built from the `front` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.