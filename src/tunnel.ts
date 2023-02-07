import net from 'net';
import { Client, ConnectConfig } from 'ssh2';

async function createServer(options: net.ListenOptions): Promise<net.Server> {
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

async function createClient(config: ConnectConfig): Promise<Client> {
  return new Promise(function (resolve, reject) {
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

export function createTunnel(
  tunnelOptions: { autoClose?: boolean },
  serverOptions: net.ListenOptions,
  sshOptions: ConnectConfig,
  forwardOptions: ForwardOptions
): Promise<[net.Server, Client]> {
  return new Promise(async function (resolve, reject) {
    let server: net.Server, conn: Client;
    try {
      server = await createServer(serverOptions);
    } catch (e) {
      return reject(e);
    }

    try {
      conn = await createClient(sshOptions);
    } catch (e) {
      return reject(e);
    }
    server.on('connection', (connection) => {
      conn.forwardOut(
        forwardOptions.srcAddr,
        forwardOptions.srcPort,
        forwardOptions.dstAddr,
        forwardOptions.dstPort,
        (err, stream) => {
          connection.pipe(stream).pipe(connection);
        }
      );
    });

    server.on('close', () => conn.end());
    resolve([server, conn]);
  });
}
