import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class CanActivateViaControllerGuard implements CanActivate {

  constructor() {}

  canActivate() {
    return localStorage.role == 'Controller';
  }
}