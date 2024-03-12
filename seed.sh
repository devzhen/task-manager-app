yarn ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/drop-tables.ts
yarn prisma generate
yarn prisma db push
yarn prisma db seed