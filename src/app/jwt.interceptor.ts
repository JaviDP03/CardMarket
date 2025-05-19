import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    const reqWithToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
    return next(reqWithToken);
  }
  return next(req);
};