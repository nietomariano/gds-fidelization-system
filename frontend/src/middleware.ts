import { defineMiddleware } from "astro:middleware";
import { Pathname } from "./config/Pathname";
import { httpClient } from "./api/http";
import { AuthService } from "./api/business/auth/auth.service";
import { CookieName } from "./config/cookies";

const AUTH_ROUTES = [Pathname.LOGIN, Pathname.REGISTER];
const CUSTOMER_AUTH_ROUTES = [Pathname.CUSTOMER_LOGIN, Pathname.CUSTOMER_REGISTER];
const PUBLIC_ROUTES = ["/", Pathname.CONTACT];

export const onRequest = defineMiddleware((context, next) => {
  // Allow public routes without authentication - CHECK THIS FIRST
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    context.url.pathname === route
  );

  if (isPublicRoute) {
    return next();
  }

  const isAuthRequest = AUTH_ROUTES.some((route) =>
    context.url.pathname.startsWith(route)
  );

  const isCustomerAuthRequest = CUSTOMER_AUTH_ROUTES.some((route) =>
    context.url.pathname.startsWith(route)
  );

  // Allow authentication pages
  if (isAuthRequest || isCustomerAuthRequest) {
    return next();
  }

  const token = context.cookies.get(CookieName.BUSINESS_TOKEN);
  const userCookie = context.cookies.get(CookieName.USER);

  const isAuthenticated = token !== undefined;

  if (isAuthenticated) {
    httpClient.setAuthorizationToken(token.value);
    
    // If authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthRequest) {
      return Response.redirect(
        new URL(Pathname.BUSINESS_DASHBOARD, context.url).toString()
      );
    }
  }

  // Handle customer portal routes
  const isCustomerAppRequest = context.url.pathname.startsWith("/customer");
  const customerToken = context.cookies.get(CookieName.CUSTOMER_TOKEN);
  const isCustomerAuthenticated = customerToken !== undefined;
  
  if (isCustomerAppRequest && !isCustomerAuthRequest) {
    if (!isCustomerAuthenticated) {
      return Response.redirect(new URL(Pathname.CUSTOMER_LOGIN, context.url).toString());
    }
    
    // Customer is authenticated, allow access
    httpClient.setAuthorizationToken(customerToken.value);
  }
  
  // If customer is authenticated and trying to access customer auth pages, redirect to dashboard
  if (isCustomerAuthenticated && isCustomerAuthRequest) {
    return Response.redirect(new URL(Pathname.CUSTOMER_DASHBOARD, context.url).toString());
  }

  const isBusinessAppRequest = context.url.pathname.startsWith("/business");

  if (isBusinessAppRequest && !isAuthenticated) {
    return Response.redirect(new URL(Pathname.LOGIN, context.url).toString());
  }

  const hasUser = userCookie !== undefined && userCookie.value !== "";

  if (hasUser && isBusinessAppRequest) {
    try {
      context.locals.user = JSON.parse(decodeURIComponent(userCookie.value));
    } catch (e) {
      // Invalid user cookie, clear it
      context.cookies.delete(CookieName.USER);
    }
  }

  if (isBusinessAppRequest && isAuthenticated && !hasUser) {
    const service = new AuthService();

    return service
      .getMyInfo()
      .then((response) => {
        context.locals.user = response.data.user;
        context.cookies.set(
          CookieName.USER,
          encodeURIComponent(JSON.stringify(response.data.user))
        );

        return next();
      })
      .catch(() => {
        return Response.redirect(
          new URL(Pathname.LOGIN, context.url).toString()
        );
      });
  }

  return next();
});
