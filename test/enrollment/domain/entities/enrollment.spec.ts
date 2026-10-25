import { EnrollmentEntity } from "../../../../src/enrollment/domain/entities/enrollment-entity.js";
import { InvalidEnrollmentTransitionError } from "../../../../src/enrollment/domain/errors/invalid-enrollment-transition-error.js";
import { EnrollmentStatusValueObject } from "../../../../src/enrollment/domain/value-objects/enrollment-status-value-object.js";

describe('Enrollment', () => {
  describe('request', () => {
    it('should create an enrollment with REQUESTED status', () => {
      const enrollment = EnrollmentEntity.request({ id: 'ENROLLMENT-001', studentId: 'STUDENT-001', courseId: 'COURSE-001' });
      expect(enrollment.id).toBe('ENROLLMENT-001');
      expect(enrollment.studentId).toBe('STUDENT-001');
      expect(enrollment.courseId).toBe('COURSE-001');
      expect(enrollment.getStatus()).toBe(EnrollmentStatusValueObject.REQUESTED);
    });

    it.each([
      ['id', { id: '' }],
      ['studentId', { studentId: '' }],
      ['courseId', { courseId: '' }],
      ['id', { id: '   ' }],
      ['studentId', { studentId: '   ' }],
      ['courseId', { courseId: '   ' }],
    ])('should reject an empty %s', (_field, override) => {
      const props = {
        id: 'enrollment-1',
        studentId: 'student-1',
        courseId: 'course-1',
        ...override,
      };

      expect(() => EnrollmentEntity.request(props)).toThrow(Error);
    });
  });

  describe('transitionTo', () => {
    it.each([EnrollmentStatusValueObject.ENROLLED, EnrollmentStatusValueObject.REJECTED])('should allow transition to %s', (targetStatus) => {
      const enrollment = EnrollmentEntity.request({
        id: 'enrollment-1',
        studentId: 'student-1',
        courseId: 'course-1',
      });

      enrollment.transitionTo(targetStatus);

      expect(enrollment.getStatus()).toBe(targetStatus);
    });

    it.each([
      [EnrollmentStatusValueObject.REQUESTED, EnrollmentStatusValueObject.REQUESTED],
      [EnrollmentStatusValueObject.ENROLLED, EnrollmentStatusValueObject.REJECTED],
      [EnrollmentStatusValueObject.ENROLLED, EnrollmentStatusValueObject.ENROLLED],
      [EnrollmentStatusValueObject.REJECTED, EnrollmentStatusValueObject.ENROLLED],
      [EnrollmentStatusValueObject.REJECTED, EnrollmentStatusValueObject.REQUESTED],
    ])('should reject transition from %s to %s', (currentStatus, targetStatus) => {
      const enrollment = EnrollmentEntity.request({
        id: 'enrollment-1',
        studentId: 'student-1',
        courseId: 'course-1',
      });

      if (currentStatus !== EnrollmentStatusValueObject.REQUESTED) {
        enrollment.transitionTo(currentStatus);
      }

      expect(() => enrollment.transitionTo(targetStatus)).toThrow(InvalidEnrollmentTransitionError);
    });
  });
});
