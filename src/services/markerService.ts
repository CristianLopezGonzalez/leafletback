import { prisma } from '../config/prisma';
import { MarkerInput } from '../types';

export class MarkerService {
    static async getMarkersByUserId(userId: string) {
        try {
            return await prisma.marker.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });
        } catch (error) {
            console.error('Error al obtener marcadores:', error);
            throw new Error('Error al obtener marcadores');
        }
    }

    static async createMarker(userId: string, markerData: MarkerInput) {
        try {
            return await prisma.marker.create({
                data: {
                    userId,
                    latitude: markerData.latitude,
                    longitude: markerData.longitude
                }
            });
        } catch (error) {
            console.error('Error al crear marcador:', error);
            throw new Error('Error al crear marcador');
        }
    }

    static async createManyMarkers(userId: string, markers: MarkerInput[]) {
        try {
            if (!markers.length) {
                throw new Error('No se enviaron marcadores para crear');
            }

            return await prisma.$transaction(
                markers.map((marker) =>
                    prisma.marker.create({
                        data: {
                            userId,
                            latitude: marker.latitude,
                            longitude: marker.longitude
                        }
                    })
                )
            );
        } catch (error) {
            console.error('Error al crear marcadores:', error);
            throw new Error('Error al crear marcadores');
        }
    }

    static async deleteMarker(userId: string, markerId: string) {
        try {
            const marker = await prisma.marker.findFirst({
                where: {
                    id: markerId,
                    userId
                }
            });

            if (!marker) {
                throw new Error('Marcador no encontrado');
            }

            await prisma.marker.delete({
                where: { id: markerId }
            });

            return marker;
        } catch (error) {
            console.error('Error al eliminar marcador:', error);
            throw new Error('Error al eliminar marcador');
        }
    }

    static async deleteManyMarkers(userId: string, markerIds: string[]) {
        try {
            if (!markerIds.length) {
                throw new Error('No se enviaron marcadores para eliminar');
            }

            const result = await prisma.marker.deleteMany({
                where: {
                    userId,
                    id: {
                        in: markerIds
                    }
                }
            });

            return result;
        } catch (error) {
            console.error('Error al eliminar marcadores:', error);
            throw new Error('Error al eliminar marcadores');
        }
    }
}