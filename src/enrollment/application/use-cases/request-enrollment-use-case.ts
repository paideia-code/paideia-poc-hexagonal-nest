import { randomUUID } from 'node:crypto';

import { EnrollmentEntity, EnrollmentRequestProps } from '../../domain/entities/enrollment-entity.js';
import { RequestEnrollmentCommand } from '../commands/request-enrollment-command.js';
import { EnrollmentRepositoryPort } from '../ports/enrollment-repository-port.js';
import { RequestEnrollmentResult } from '../result/request-enrollment-result.js';
import { EnrollmentExistsActiveQuery } from '../query/enrollment-exists-active-query.js';
import { RequestEnrollmentExistsActiveError } from '../errors/request-enrollment-exists-active-error.js';

export class RequestEnrollmentUseCase {
  constructor(private readonly enrollmentRepository: EnrollmentRepositoryPort) {}

  public request(command: RequestEnrollmentCommand): RequestEnrollmentResult {
    /* Validar si ya existe */
    const enrollmentExistsActiveQuery: EnrollmentExistsActiveQuery = {
      studentId: command.studentId,
      courseId: command.courseId,
    };
    if (this.enrollmentRepository.existsActive(enrollmentExistsActiveQuery)) {
      throw new RequestEnrollmentExistsActiveError();
    }

    /* Crear entidad de dominio*/
    const prop: EnrollmentRequestProps = {
      id: randomUUID(),
      studentId: command.studentId,
      courseId: command.courseId,
    };

    const enrollmentEntity = EnrollmentEntity.request(prop);

    /* Persistir */
    this.enrollmentRepository.save(enrollmentEntity);

    /* Retornar */
    const requestEnrollmentResult: RequestEnrollmentResult = { id: enrollmentEntity.id, studentId: enrollmentEntity.studentId, courseId: enrollmentEntity.courseId, status: enrollmentEntity.getStatus(), createdAt: enrollmentEntity.getCreatedAt(), updatedAt: enrollmentEntity.getUpdatedAt() };

    return requestEnrollmentResult;
  }
}
