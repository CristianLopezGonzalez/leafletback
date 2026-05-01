import { JwtPayload } from '@/types';
import { prisma } from '../config/prisma'
import { JwtUtils } from '../utils/jwtUtils'
import bcrypt from 'bcrypt';


export class AuthService {
    static async register(username: string, email: string, password: string) {

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            throw new Error('Error correo ya registrado');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: passwordHash
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                markers: true
            }
        })

        const payload: JwtPayload = {
            id: user.id,
            email: user.email
        }

        const token = JwtUtils.crearToken(payload)
        const refreshToken = JwtUtils.crearRefreshToken(payload)

        const createRefreshToken = await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                //expira en 30 dias
            },
        })

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                markers: user.markers
            },
            accessToken: token,
            refreshToken: createRefreshToken.token
        };

    }

    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                username: true,
                email: true,
                password: true,
                createdAt: true,
                markers: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!user) {
            throw new Error('Error correo o contraseña incorrectos');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Error correo o contraseña incorrectos');
        }

        const payload: JwtPayload = {
            id: user.id,
            email: user.email
        }

        const token = JwtUtils.crearToken(payload)
        const refreshToken = JwtUtils.crearRefreshToken(payload)

        const createRefreshToken = await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        })

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                markers: user.markers
            },
            accessToken: token,
            refreshToken: createRefreshToken.token
        };
    }

    static async refreshToken(oldRefreshToken: string) {
        const existingToken = await prisma.refreshToken.findUnique({
            where: { token: oldRefreshToken },
            include: { user: true }
        });

        if (!existingToken || existingToken.expiresAt < new Date()) {
            throw new Error('Refresh token inválido o expirado');
        }

        const payload: JwtPayload = {
            id: existingToken.user.id,
            email: existingToken.user.email
        }

        const token = JwtUtils.crearToken(payload)
        const refreshToken = JwtUtils.crearRefreshToken(payload)

        return {
            accessToken: token,
            refreshToken: refreshToken
        };
    }

    static async logout(refreshToken: string) {
        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken }
        });
    }

    static async logoutAll(userId: string) {
        await prisma.refreshToken.deleteMany({
            where: { userId }
        });
    }
}