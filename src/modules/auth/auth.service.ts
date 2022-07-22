import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signin(username: string, password: string) {
    return { msg: 'I have signed in' };
  }
  signup(username: string, password: string) {
    return { msg: 'I have signed up' };
  }
}
