import { User } from "./user.interface";
import { Request } from "express";

export interface RequestUser extends Request{
    user: User;
}