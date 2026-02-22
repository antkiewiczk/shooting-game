import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

export class SessionNotFoundException extends NotFoundException {
  constructor() {
    super('Session not found');
  }
}

export class SessionAlreadyFinishedException extends BadRequestException {
  constructor() {
    super('Session already finished');
  }
}

export class NotYourSessionException extends ForbiddenException {
  constructor() {
    super('Not your session');
  }
}

export class UserNotFoundException extends ForbiddenException {
  constructor() {
    super('User not found');
  }
}
