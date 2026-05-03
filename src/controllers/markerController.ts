import { NextFunction, Request, Response } from 'express';
import { HttpResponse } from '../middlewares/httpResponse';
import { MarkerService } from '../services/markerService';

const http = new HttpResponse();


const isIdArray = (value: unknown): value is string[] => {
    return Array.isArray(value);
};

export class MarkerController {
    static async getMyMarkers(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return http.UNAUTHORIZED(res, 'Usuario no autenticado');
            }

            const markers = await MarkerService.getMarkersByUserId(userId);
            return http.OK(res, markers, 'Marcadores obtenidos exitosamente');
        } catch (error) {
            return next(error);
        }
    }

    static async getUserMarkers(req: Request, res: Response, next: NextFunction) {
        try {
            const userIdParam = req.params.userId;
            const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;

            if (!userId) {
                return http.BAD_REQUEST(res, 'userId es requerido');
            }

            const markers = await MarkerService.getMarkersByUserId(userId);
            return http.OK(res, markers, 'Marcadores del usuario obtenidos exitosamente');
        } catch (error) {
            return next(error);
        }
    }

    static async createMarker(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return http.UNAUTHORIZED(res, 'Usuario no autenticado');
            }

            const markersFromBody = req.body 

            if (Array.isArray(markersFromBody)) {
                if (!markersFromBody.length) {
                    return http.BAD_REQUEST(res, 'markers es requerido y debe ser un arreglo no vacío');
                }

                const createdMarkers = await MarkerService.createManyMarkers(userId, markersFromBody);
                return http.CREATED(res, createdMarkers, 'Marcadores creados exitosamente');
            }

            const { latitude, longitude, label } = req.body;

            if (latitude === undefined || longitude === undefined || label === undefined) {
                return http.BAD_REQUEST(res, 'latitude, longitude y label son requeridos');
            }

            const marker = await MarkerService.createMarker(userId, { latitude, longitude, label });
            return http.CREATED(res, marker, 'Marcador creado exitosamente');
        } catch (error) {
            return next(error);
        }
    }

    static async createManyMarkers(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return http.UNAUTHORIZED(res, 'Usuario no autenticado');
            }

            const markers = Array.isArray(req.body) ? req.body : req.body.markers;

            if (!Array.isArray(markers) || !markers.length) {
                return http.BAD_REQUEST(res, 'markers es requerido y debe ser un arreglo no vacío');
            }

            const createdMarkers = await MarkerService.createManyMarkers(userId, markers);
            return http.CREATED(res, createdMarkers, 'Marcadores creados exitosamente');
        } catch (error) {
            return next(error);
        }
    }

    static async deleteMarker(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return http.UNAUTHORIZED(res, 'Usuario no autenticado');
            }

            const idsFromBody = req.body.ids ?? req.body.markerIds ?? req.body.id;

            if (isIdArray(idsFromBody)) {
                if (!idsFromBody.length) {
                    return http.BAD_REQUEST(res, 'ids es requerido y debe ser un arreglo no vacío');
                }

                const result = await MarkerService.deleteManyMarkers(userId, idsFromBody);
                return http.OK(res, result, 'Marcadores eliminados exitosamente');
            }

            const idParam = req.params.id;
            const id = Array.isArray(idParam) ? idParam[0] : idParam;

            const singleId = typeof idsFromBody === 'string' ? idsFromBody : id;

            if (!singleId) {
                return http.BAD_REQUEST(res, 'id es requerido');
            }

            const marker = await MarkerService.deleteMarker(userId, singleId);
            return http.OK(res, marker, 'Marcador eliminado exitosamente');
        } catch (error) {
            return next(error);
        }
    }

    static async filterMarkersByLabel(req: Request, res: Response, next: NextFunction) { 
        try { 

            const userId = req.user?.id;

            if (!userId) {
                return http.UNAUTHORIZED(res, 'Usuario no autenticado');
            }

            const { label } = req.query;

            if (typeof label !== 'string' || !label.trim()) {
                return http.BAD_REQUEST(res, 'label es requerido y debe ser una cadena no vacía');
            }

            const markers = await MarkerService.filterMarkersByLabel(userId, label);
            return http.OK(res, markers, 'Marcadores filtrados exitosamente');

        }catch (error) {
            return next(error);
        }
    }

}