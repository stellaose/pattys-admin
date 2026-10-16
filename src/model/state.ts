/* eslint-disable @typescript-eslint/no-namespace */

export namespace State {
  export interface App {
    request: any;
    response: any;
    url: string;
    isLoggedIn: boolean;
    isForgotPassword: boolean;
    adminId: string;
    user: any;
  }
}
