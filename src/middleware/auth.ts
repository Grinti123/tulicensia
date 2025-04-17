import { NextApiRequest, NextApiResponse } from 'next';
import { getTokenCookie } from '../utils/cookies';
import { sanitizeObject } from '../utils/sanitize';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const withAuth = (handler: Function) => async (
  req: AuthRequest,
  res: NextApiResponse
) => {
  try {
    const token = getTokenCookie(req);

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    return handler(req, res);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const validateRequest = (schema: any) => async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: Function
) => {
  try {
    // Sanitize request body
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }

    // Validate against schema
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.errors,
    });
  }
};

export const rateLimit = (options: {
  windowMs: number;
  max: number;
}) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!requests.has(ip as string)) {
      requests.set(ip as string, {
        count: 1,
        resetTime: now + options.windowMs,
      });
    } else {
      const request = requests.get(ip as string)!;

      if (now > request.resetTime) {
        request.count = 1;
        request.resetTime = now + options.windowMs;
      } else if (request.count >= options.max) {
        return res.status(429).json({
          error: 'Too many requests',
          retryAfter: Math.ceil((request.resetTime - now) / 1000),
        });
      } else {
        request.count++;
      }
    }

    // Clean up old entries
    for (const [ip, request] of requests.entries()) {
      if (now > request.resetTime) {
        requests.delete(ip);
      }
    }

    next();
  };
};
