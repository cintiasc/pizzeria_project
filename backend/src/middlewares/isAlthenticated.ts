import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface Payload{
    sub: string;
}

export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
){
    // get the token
    const authToken = req.headers.authorization;

    if(!authToken){
        return res.status(401).end();
    }

    const [, token] = authToken.split(" ")

    try {
        //check token
        const { sub } = verify(
            token,
            process.env.JWT_SECRET
        ) as Payload;
        
        //get the token id and put it in a user_id inside the req
        req.user_id = sub
        return next();

    } catch (error) {
        return res.status(401).end();
    }
}