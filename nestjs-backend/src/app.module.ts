import { Module } from '@nestjs/common';
import { portfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [portfolioModule],
})

export class AppModule {}
