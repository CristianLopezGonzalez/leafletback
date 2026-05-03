export interface User{
    id:string,
    username:string,
    email:string,
    password:string,
    latitude?:number,
    longitude?:number,
    isOnline:boolean,
    createdAt:Date,
    updatedAt?:Date,
    markers?: Marker[]
}

export interface Marker {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}

export interface MarkerInput {
  latitude: number;
  longitude: number;
  label: string;
}

export interface LocationHistory {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  username: string;
}
 
export interface JwtPayload {
  id: string;
  email: string;
}

declare global {
    namespace Express {
        export interface Request {
            user?: JwtPayload;
        }
    }
}