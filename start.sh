#!/bin/sh

# Aguarde o banco de dados estar disponível
echo "Aguardando o banco de dados..."

while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
  sleep 0.1
done

echo "Banco de dados está disponível!"

# Execute os seeds
npm run seed-user
npm run seed-post

# Inicie a aplicação
node dist/src/main