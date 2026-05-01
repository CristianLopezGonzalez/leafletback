import { prisma } from '../config/prisma';

export class UserService {
    static async getOnlineUsers() {
        try {

            const users = await prisma.user.findMany({
                where: {
                    isOnline: true
                },
                select: {
                    id: true,
                    isOnline: true,
                    username: true,
                    latitude: true,
                    longitude: true,
                        markers: {
                            orderBy: {
                                createdAt: 'desc'
                            }
                        },
                    updatedAt: true
                }
            });

            return users;
            
        } catch (error) {
            console.error('Error al obtener usuarios en línea:', error);
            throw new Error('Error al obtener usuarios en línea');
        }
    }

    static async getUserProfile(userId: string) {
        try {

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    isOnline: true,
                    latitude: true,
                    longitude: true,
                    markers: {
                        orderBy: {
                            createdAt: 'desc'
                        }
                    },
                    createdAt: true,
                }
            })

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            return user;

        } catch (error) {
            console.error('Error al obtener perfil de usuario:', error);
            throw new Error('Error al obtener perfil de usuario');
        }
    }

    static async getUserLocationHistory(userId: string) {
        try {

            const locationHistory = await prisma.locationHistory.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });

            if (!locationHistory) {
                throw new Error('Historial de ubicación no encontrado');
            }

            return locationHistory;
        } catch (error) {
            console.error('Error al obtener historial de ubicación:', error);
            throw new Error('Error al obtener historial de ubicación');
        }
    }

}