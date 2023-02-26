import { Static, Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import Ajv from 'ajv';

const ajv = new Ajv.default({ useDefaults: true });

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
  port: Type.Number({ default: 22 }),
  username: Type.String(),
});
export type SSHOptions = Static<typeof sshOptions>;

export const isSshOptions = (v: unknown) => ajv.validate(sshOptions, v);
