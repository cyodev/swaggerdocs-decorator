import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExampleModule } from './swaggerdocs-decorator/example/example.module';

@Module({
  imports: [ExampleModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
