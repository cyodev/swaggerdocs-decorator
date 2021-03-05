import { Module } from '@nestjs/common';
import { SwaggerDocs } from './swagger-docs.decorator';

@Module({
  imports: [],
  exports: [SwaggerDocs]
})
export class AppModule {}
