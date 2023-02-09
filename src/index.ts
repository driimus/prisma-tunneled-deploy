import { execa } from 'execa';
import { createTunnel } from './tunnel.js';
import { DBCredentials, isDbCredentials, isSshOptions, SSHOptions } from './validation.js';

export async function deployMigrations(credentials: DBCredentials, sshOptions: SSHOptions) {
  if (!isDbCredentials(credentials) || !isSshOptions(sshOptions))
    throw new Error('Arguments must match provided types');

  const forwardOptions = {
    srcAddr: '127.0.0.1',
    srcPort: credentials.port,
    dstAddr: credentials.host,
    dstPort: credentials.port,
  };

  const { server } = await createTunnel(
    {
      port: credentials.port,
    },
    {
      ...sshOptions,
      port: 22,
      username: 'ubuntu',
    },
    forwardOptions
  );

  const { stdout } = await execa('prisma', ['migrate', 'deploy'], {
    env: {
      DATABASE_URL: credentials.url,
    },
    shell: true,
  });

  console.log(stdout);

  server.close();
}
