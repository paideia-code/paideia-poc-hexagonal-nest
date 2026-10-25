import { Module } from '@nestjs/common';
import { EnrollmentModule } from './enrollment/enrollment.module.js';

@Module({
  imports: [EnrollmentModule],
})
export class AppModule {}
