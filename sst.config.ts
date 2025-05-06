/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'island-bid-starter-backend',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc('BidRegistryBackendVpc');
    const cluster = new sst.aws.Cluster('BidRegistryBackendCluster', { vpc });

    const POSTGRES_USER = process.env.POSTGRES_USER ?? 'test_user';
    const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? 'test_user';
    const POSTGRES_DB = process.env.POSTGRES_DB ?? 'test_database';

    new sst.aws.Service('BidRegistryBackendService', {
      cluster,
      containers: [
        {
          name: 'backend',
          image: {
            dockerfile: 'Dockerfile-backend',
          },
          environment: {
            DATABASE_URL: `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}`,
          },
        },
        {
          name: 'postgresql',
          image: {
            dockerfile: 'Dockerfile-database',
          },
          environment: {
            POSTGRES_PASSWORD: POSTGRES_PASSWORD,
            POSTGRES_USER: POSTGRES_USER,
            POSTGRES_DB: POSTGRES_DB,
          },
        },
      ],
      loadBalancer: {
        rules: [
          { listen: '80/http', forward: '3000/http', container: 'backend' },
        ],
      },
      dev: {
        command: 'yarn start:dev',
      },
    });
  },
});
