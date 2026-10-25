import { EnrollmentEntity } from '../../domain/entities/enrollment-entity.js';
import { EnrollmentExistsActiveQuery } from '../query/enrollment-exists-active-query.js';

export interface EnrollmentRepositoryPort {
  existsActive(query: EnrollmentExistsActiveQuery): boolean;
  save(enrollment: EnrollmentEntity): void;
}
