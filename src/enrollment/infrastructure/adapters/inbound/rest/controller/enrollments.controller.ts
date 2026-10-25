import { Body, Controller, Post, HttpCode, HttpStatus, ConflictException } from '@nestjs/common';
import { RequestEnrollmentUseCase } from '../../../../../application/use-cases/request-enrollment-use-case.js';
import { RequestEnrollmentDto } from '../dto/request-enrollment-dto.js';
import { RequestEnrollmentCommand } from '../../../../../application/commands/request-enrollment-command.js';
import { RequestEnrollmentResponseDto } from '../dto/request-enrollment-response-dto.js';
import { RequestEnrollmentExistsActiveError } from '../../../../../application/errors/request-enrollment-exists-active-error.js';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly requestEnrollmentUseCase: RequestEnrollmentUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public requestEnrollment(@Body() dto: RequestEnrollmentDto): RequestEnrollmentResponseDto {
    const command: RequestEnrollmentCommand = {
      studentId: dto.studentId,
      courseId: dto.courseId,
    };

    try {
      const result = this.requestEnrollmentUseCase.request(command);

      const requestEnrollmentResponseDto: RequestEnrollmentResponseDto = {
        id: result.id,
        studentId: result.studentId,
        courseId: result.courseId,
        status: result.status,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };

      return requestEnrollmentResponseDto;
    } catch (error) {
      if (error instanceof RequestEnrollmentExistsActiveError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }
}
