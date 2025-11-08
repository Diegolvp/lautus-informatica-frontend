import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Pega token do localStorage
  const token = localStorage.getItem('auth_token');
  
  // Se tem token, CLONA a requisição adicionando o header
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }
  
  // Se não tem token, passa a requisição normal
  return next(req);
};