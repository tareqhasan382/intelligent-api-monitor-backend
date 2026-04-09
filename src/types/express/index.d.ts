import express from "express";

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
      //user?: Record<string, any>;
    }
  }
}