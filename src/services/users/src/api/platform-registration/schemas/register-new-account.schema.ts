import { RegisterNewAccountPayload } from '@core/platform-registration/platform-registration.types';

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    RegisterNewAccount:
 *      required:
 *        - email
 *        - password
 *      properties:
 *       email:
 *         type: string
 *         format: email
 *         example: john@doe.com
 *       password:
 *         type: string
 *         example: test123
 */
export class RegisterNewAccountSchema implements RegisterNewAccountPayload {
  email: string;

  password: string;
}
