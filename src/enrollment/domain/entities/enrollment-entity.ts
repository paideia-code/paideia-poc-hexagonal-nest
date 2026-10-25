import { InvalidEnrollmentTransitionError } from '../errors/invalid-enrollment-transition-error.js';
import { EnrollmentStatusValueObject } from '../value-objects/enrollment-status-value-object.js';

export interface EnrollmentRequestProps {
  id: string;
  studentId: string;
  courseId: string;
  createdAt?: Date;
}

interface EnrollmentProps {
  id: string;
  studentId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class EnrollmentEntity {
  public readonly id: string;
  public readonly studentId: string;
  public readonly courseId: string;
  private status: EnrollmentStatusValueObject;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(props: EnrollmentProps) {
    this.id = props.id;
    this.studentId = props.studentId;
    this.courseId = props.courseId;
    this.status = EnrollmentStatusValueObject.REQUESTED;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public getStatus(): EnrollmentStatusValueObject {
    return this.status;
  }

  public getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  public getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  public static request(props: EnrollmentRequestProps): EnrollmentEntity {
    validateRequiredField(props.id, 'id');
    validateRequiredField(props.studentId, 'studentId');
    validateRequiredField(props.courseId, 'courseId');

    const createdAt = props.createdAt ?? new Date();
    validateDate(createdAt, 'createdAt');

    const enrollment = new EnrollmentEntity({
      id: props.id,
      studentId: props.studentId,
      courseId: props.courseId,
      createdAt,
      updatedAt: createdAt,
    });

    return enrollment;
  }

  public transitionTo(status: EnrollmentStatusValueObject): void {
    if (this.status !== EnrollmentStatusValueObject.REQUESTED || (status !== EnrollmentStatusValueObject.ENROLLED && status !== EnrollmentStatusValueObject.REJECTED)) {
      throw new InvalidEnrollmentTransitionError(this.status, status);
    }

    this.status = status;
    this.updatedAt = new Date();
  }
}

function validateRequiredField(value: string | undefined, fieldName: string): void {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} is required`);
  }
}

function validateDate(value: Date, fieldName: string): void {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new TypeError(`${fieldName} must be a valid date`);
  }
}
