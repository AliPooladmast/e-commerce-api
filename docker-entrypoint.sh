echo "demigrating the database..."
npm run db:down

echo "migrating the database..."
npm run db:up

echo "starting the server..."
npm start