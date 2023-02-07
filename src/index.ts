import { Static, Type } from '@sinclair/typebox';
import { execa } from 'execa';
import { createTunnel } from './tunnel.js';

const dbCredentialsShema = Type.Object({
  host: Type.String(),
  port: Type.Number(),
  username: Type.String(),
  password: Type.String(),
  url: Type.String(),
});

type DBCredentials = Static<typeof dbCredentialsShema>;

const tunnelSchema = Type.Object({
  host: Type.String(),
  privateKey: Type.String(),
});

type TunnelOptions = Static<typeof tunnelSchema>;

export async function deployMigrations(db: DBCredentials, tunnel: TunnelOptions) {
  // validate params
  const sshOptions = {
    ...tunnel,
    port: 22,
    username: 'ubuntu',
  };

  const [server] = await createTunnel(
    { autoClose: false },
    {
      port: db.port,
    },
    sshOptions,
    { srcAddr: '127.0.0.1', srcPort: db.port, dstPort: db.port, dstAddr: db.host }
  );

  const { stdout } = await execa('prisma', ['migrate', 'status'], {
    env: {
      DATABASE_URL: db.url,
    },
    shell: true,
  });

  console.log(stdout);

  server.close();
}
