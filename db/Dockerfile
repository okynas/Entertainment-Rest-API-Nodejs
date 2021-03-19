# FROM bitnami/mariadb:latest

# ENV ALLOW_EMPTY_PASSWORD=yes
# ENV MARIADB_USER=admin
# ENV MARIADB_PASSWORD=admin
# ENV MARIADB_DATABASE=test_db

FROM mysql:8.0.17

COPY *.sql /docker-entrypoint-initdb.d/