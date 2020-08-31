module.exports = {
  type: process.env.DATABASE_TYPE,
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [process.env.ORM_ENTITIES || 'dist/models/**/*.js'],
  migrations: [
    process.env.ORM_MIGRATIONS || 'dist/database/migrations/**/*.js',
  ],
  subcribers: [process.env.ORM_SUBCRIBERS || 'dist/subcribers/**/*.js'],
  cli: {
    entitiesDir: process.env.ORM_ENTITIES_DIR,
    migrationsDir: process.env.ORM_MIGRATIONS_DIR,
    subcribersDir: process.env.ORM_SUBCRIBERS_DIR,
  },
};
