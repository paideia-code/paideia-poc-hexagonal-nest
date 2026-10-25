import { Module } from '@nestjs/common';
import { EnrollmentsController } from './infrastructure/adapters/inbound/rest/controller/enrollments.controller.js';
import { ENROLLMENT_REPOSITORY } from './application/tokens/enrollment-repository.token.js';
import { InMemoryEnrollmentRepositoryAdapter } from './infrastructure/adapters/outbound/persistence/in-memory-enrollment-repository-adapter.js';
import { RequestEnrollmentUseCase } from './application/use-cases/request-enrollment-use-case.js';
import { EnrollmentRepositoryPort } from './application/ports/enrollment-repository-port.js';

@Module({
  imports: [],
  controllers: [EnrollmentsController],
  providers: [
    {
      provide: ENROLLMENT_REPOSITORY,
      useClass: InMemoryEnrollmentRepositoryAdapter,
    },
    {
      provide: RequestEnrollmentUseCase,
      useFactory: (repository: EnrollmentRepositoryPort) => {
        return new RequestEnrollmentUseCase(repository);
      },
      inject: [ENROLLMENT_REPOSITORY],
    },
  ],
})
export class EnrollmentModule {}
