import { auth } from "@/auth";

// Handle all auth requests
export const GET = (req: Request) => auth.handler(req);
export const POST = (req: Request) => auth.handler(req);
