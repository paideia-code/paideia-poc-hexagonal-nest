import { EnrollmentStatusValueObject } from '../value-objects/enrollment-status-value-object.js';

export class InvalidEnrollmentTransitionError extends Error {

  constructor(currentStatus: EnrollmentStatusValueObject, requestedStatus: EnrollmentStatusValueObject) {
    super(`Invalid enrollment transition from ${currentStatus} to ${requestedStatus}`);
    this.name = 'InvalidEnrollmentTransitionError';
  }
  
}
