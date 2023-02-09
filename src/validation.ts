import { Static, Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

const dbCredentials = Type.Object({
  host: Type.String(),
  port: Type.Number(),
  username: Type.String(),
  password: Type.String(),
  url: Type.String(),
});
export type DBCredentials = Static<typeof dbCredentials>;

const credentialsSchema = TypeCompiler.Compile(dbCredentials);
export const isDbCredentials = (v: unknown) => credentialsSchema.Check(v);

const sshOptions = Type.Object({
  host: Type.String(),
  privateKey: Type.String(),
});
export type SSHOptions = Static<typeof sshOptions>;

const sshOptionsSchema = TypeCompiler.Compile(sshOptions);
export const isSshOptions = (v: unknown) => sshOptionsSchema.Check(v);
