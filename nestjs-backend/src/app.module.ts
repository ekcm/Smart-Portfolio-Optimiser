import { Module } from '@nestjs/common';
import { portfolioModule } from './module/portfolio.module';

@Module({
  imports: [portfolioModule],
})

export class AppModule {}
