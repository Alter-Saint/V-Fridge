import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",
  },
});

export const config = { 
  matcher: [
    "/", 
    "/settings", 
    "/recipe",
    "/api/products/:path*"
  ] 
};