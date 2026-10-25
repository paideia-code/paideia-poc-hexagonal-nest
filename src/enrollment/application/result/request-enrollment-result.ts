import { EnrollmentStatusValueObject } from "../../domain/value-objects/enrollment-status-value-object.js";

export interface RequestEnrollmentResult {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatusValueObject;
  createdAt: Date;
  updatedAt: Date;
}
