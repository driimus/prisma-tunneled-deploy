import net from 'net';
import { Client, ConnectConfig } from 'ssh2';

function createServer(options: net.ListenOptions): Promise<net.Server> {
  return new Promise((resolve, reject) => {
    let server = net.createServer();
    let errorHandler = function (error: unknown) {
      reject(error);
    };
    server.on('error', errorHandler);
    process.on('uncaughtException', errorHandler);
    server.listen(options);
    server.on('listening', () => {
      process.removeListener('uncaughtException', errorHandler);
      resolve(server);
    });
  });
}

function createClient(config: ConnectConfig): Promise<Client> {
  return new Promise((resolve, reject) => {
    let conn = new Client();
    conn.on('ready', () => resolve(conn));
    conn.on('error', reject);
    conn.connect(config);
  });
}

type ForwardOptions = {
  srcAddr: string;
  srcPort: number;
  dstAddr: string;
  dstPort: number;
};

export async function createTunnel(
  serverOptions: net.ListenOptions,
  sshOptions: ConnectConfig,
  forwardOptions: ForwardOptions
): Promise<{ server: net.Server; client: Client }> {
  const server = await createServer(serverOptions);
  const client = await createClient(sshOptions);

  server.on('connection', (connection) => {
    client.forwardOut(
      forwardOptions.srcAddr,
      forwardOptions.srcPort,
      forwardOptions.dstAddr,
      forwardOptions.dstPort,
      (err, stream) => {
        connection.pipe(stream).pipe(connection);
      }
    );
  });

  server.on('close', () => client.end());

  return { server, client };
}
