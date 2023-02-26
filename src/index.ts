import { execa } from 'execa';
import { createTunnel } from './tunnel.js';
import { DBCredentials, isDbCredentials, isSshOptions, SSHOptions } from './validation.js';

const detectPackageManager = () => process.env.npm_config_user_agent?.split('/')?.[0] ?? 'npm';

type SetOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export async function deployMigrations(
  credentials: DBCredentials,
  sshOptions: SetOptional<SSHOptions, 'port'>
) {
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
    sshOptions,
    forwardOptions
  );

  const { stdout } = await execa(detectPackageManager(), ['prisma', 'migrate', 'deploy'], {
    env: {
      DATABASE_URL: credentials.url,
    },
    shell: true,
  });

  console.log(stdout);

  server.close();
}
