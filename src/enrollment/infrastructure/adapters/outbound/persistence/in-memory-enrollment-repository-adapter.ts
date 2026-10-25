import { EnrollmentRepositoryPort } from '../../../../application/ports/enrollment-repository-port.js';
import { EnrollmentExistsActiveQuery } from '../../../../application/query/enrollment-exists-active-query.js';
import { EnrollmentEntity } from '../../../../domain/entities/enrollment-entity.js';
import { EnrollmentStatusValueObject } from '../../../../domain/value-objects/enrollment-status-value-object.js';
import { EnrollmentPersistenceRecord } from './enrollment-persistence-record.js';

export class InMemoryEnrollmentRepositoryAdapter implements EnrollmentRepositoryPort {
  private readonly enrollments: EnrollmentPersistenceRecord[] = [];
  existsActive(query: EnrollmentExistsActiveQuery): boolean {
    const activeStatus = new Set([EnrollmentStatusValueObject.REQUESTED, EnrollmentStatusValueObject.ENROLLED]);
    return this.enrollments.some((enrollment) => enrollment.studentId === query.studentId && enrollment.courseId === query.courseId && activeStatus.has(enrollment.status));
  }

  save(enrollment: EnrollmentEntity): void {
    const enrollmentPersistenceRecord: EnrollmentPersistenceRecord = {
      id: enrollment.id,
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      status: enrollment.getStatus(),
      createdAt: enrollment.getCreatedAt(),
      updatedAt: enrollment.getUpdatedAt(),
    };

    const stored = {
      ...enrollmentPersistenceRecord,
      createdAt: new Date(enrollmentPersistenceRecord.createdAt),
      updatedAt: new Date(enrollmentPersistenceRecord.updatedAt),
    };

    this.enrollments.push(stored);
  }
}
