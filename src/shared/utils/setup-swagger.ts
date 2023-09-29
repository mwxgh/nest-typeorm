import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import config from '@/config/config';
import { AppConstant } from '@/constants';

const appConfig = config().app;

export function setupSwagger(app: INestApplication): void {
  if (![AppConstant.dev, AppConstant.serverDev].includes(appConfig.env)) {
    return;
  }

  const documentBuilder = new DocumentBuilder()
    .setTitle('API')
    .setDescription(
      `[REST Resource Naming Guide](https://restfulapi.net/resource-naming/)`,
    )
    .setVersion('1.0');

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  console.info(`Documentation: http://localhost:${appConfig.port}/swagger`);
}
