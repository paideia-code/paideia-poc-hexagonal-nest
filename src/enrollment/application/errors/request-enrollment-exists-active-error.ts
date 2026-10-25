export class RequestEnrollmentExistsActiveError extends Error {
  constructor() {
    super(`Request enrollment is already registered.`);
    this.name = RequestEnrollmentExistsActiveError.name;
  }
}
