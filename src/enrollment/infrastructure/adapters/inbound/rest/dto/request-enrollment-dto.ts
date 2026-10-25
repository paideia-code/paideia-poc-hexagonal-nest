import { IsNotEmpty, IsString } from 'class-validator';

export class RequestEnrollmentDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;
}