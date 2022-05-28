import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
      ...defaultAuthProviderFactories,
      google: providers.google.create({
        signIn: {
          resolver: async (info, ctx) => {
            const {
              profile: { email },
            } = info;

            if (!email) {
              throw new Error('User profile contained no email');
            }

            const [name] = email.split('@');

            return ctx.signInWithCatalogUser({
              entityRef: { name },
            });
          },
        },
      }),
    },
  });
}
