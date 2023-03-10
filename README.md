# prisma-tunneled-deploy

Deploy Prisma Migrations to a remote database through SSH tunneling.

## Installation

```sh
pnpm add -D prisma-tunneled-deploy
```

## Usage

> **Warning**
> Your package manager must have access to the `prisma` binary.

### Deploy migrations through a script

1. Create a new file where you source all the required inputs.

   ```mjs
   // ./scripts/deploy.mjs
   import { deployMigrations } from 'prisma-tunneled-deploy';
   import { readFileSync } from 'fs';

   const dbCredentials = {
     host: 'localhost',
     port: 5432,
     username: 'postgres',
     password: 'postgres',
   };

   await deployMigrations(
     {
       ...dbCredentials,
       url: `postgresql://${dbCredentials.username}:${dbCredentials.password}@${dbCredentials.host}:${dbCredentials.port}`,
     },
     {
       // details of the bastion host used for SSH tunneling
       host: '192.168.100.100',
       privateKey: readFileSync('/path/to/my/key').toString('utf-8'),
       username: 'ubuntu',
     }
   );
   ```

1. Set up a script in your `package.json` file that will execute it:

   ```json
   {
     "scripts": {
       "migrate:deploy": "./scripts/deploy.mjs"
     }
   }
   ```

1. Make sure the file is executable, and run the script:

   ```sh
   pnpm migrate:deploy
   ```
