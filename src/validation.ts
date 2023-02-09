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
export const isDbCredentials = TypeCompiler.Compile(dbCredentials).Check;

const tunnelingOptions = Type.Object({
  host: Type.String(),
  privateKey: Type.String(),
});
export type TunnelingOptions = Static<typeof tunnelingOptions>;
export const isTunnelingOptions = TypeCompiler.Compile(tunnelingOptions).Check;
