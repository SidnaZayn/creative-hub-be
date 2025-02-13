import { Days, PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import spaceImage from '../space-image/space-image.service.js';
import spaceSession from '../space-session/space-session.service.js';
import spacePolicyService from '../space-policy/space-policy.service.js';

const prisma = new PrismaClient();

const createSpace = async (body, dbClient = prisma) => {
    const data = await dbClient.space.create({
        data: {
            name: body.name,
            ownerId: body.ownerId,
            description: body.description,
            city: body.city,
            address: body.address,
            features: body.features,
            capacity: body.capacity,
            pricePerHour: body.pricePerHour,
            categoryId: body.categoryId,
        },
    });

    return data;
};

const createSpaceWithImage = async (spaceData_, files, sessionData, policies) => {
    try {
        return await prisma.$transaction(
            async (trx) => {
                // 1. create space
                let { capacity, pricePerHour, ...spaceData } = spaceData_;
                capacity = parseInt(capacity);
                pricePerHour = parseInt(pricePerHour);
                spaceData = {
                    capacity,
                    pricePerHour,
                    ...spaceData,
                };
                const insertedSpaceData = await createSpace(spaceData, trx);

                //2. upload images to cloudinary
                const uploadedImages = [];
                for (const file of files) {
                    const uploadResult = await cloudinary.uploader.upload(file.path, {
                        folder: `CreativeHub/spaces/${insertedSpaceData.id}`,
                        resource_type: 'image',
                    });

                    //insert data to space image table
                    const imgData = await spaceImage.createSpaceImage(trx, {
                        filename: file.filename,
                        spaceId: insertedSpaceData.id,
                        size: file.size,
                        url: uploadResult.secure_url.replace('upload/', 'upload/f_webp/'),
                        publicId: uploadResult.public_id, //didn't used yet in controller
                    });

                    const size = JSON.stringify(imgData.size);
                    uploadedImages.push({ size: size, ...imgData });

                    fs.unlinkSync(file.path);
                }

                //3. crate space session
                const sessionDataArr = [];
                const sessionsData = JSON.parse(sessionData);
                for (let i = 0; i < sessionsData.length; i++) {
                    const insertedSession = await spaceSession.createSpaceSession(trx, {
                        spaceId: insertedSpaceData.id,
                        day: sessionsData[i].day,
                        startTime: sessionsData[i].startTime,
                        endTime: sessionsData[i].endTime,
                    });
                    sessionDataArr.push(insertedSession);
                }

                //4. create space policies
                const policiesData = policies.map(async (policy) => {
                    const data = await spacePolicyService.createSpacePolicy(trx, {
                        spaceId: insertedSpaceData.id,
                        policy,
                    });
                    return data;
                });
                return {
                    space: insertedSpaceData,
                    images: uploadedImages,
                    sessions: sessionDataArr,
                    policies: await Promise.all(policiesData),
                };
            },
            {
                timeout: 10000, //ms
            }
        );
    } catch (error) {
        throw error;
    }
};

const createSpaceWithImage_ = async (body) => {
    // if (body.images === undefined || body.images.length === 0) throw new Error('space images is required!');

    const spaceData = await createSpace(body);

    const spaceImages = body.images.map(async (img) => {
        const imgData = await spaceImage.createSpaceImage({
            filename: img.filename,
            spaceId: spaceData.id,
            size: img.size,
            url: img.url,
        });
        const size = JSON.stringify(imgData.size);
        return { size: size, ...imgData };
    });

    const imagesData = await Promise.all(spaceImages);

    return { ...spaceData, images: imagesData };
};

const getSpaces = async (params) => {
    let page = 0;
    let size = 10;
    let where = {};

    if (params.page) {
        page = parseInt(params.page);
    }
    if (params.size) {
        size = parseInt(params.size);
    }
    if (params.name) {
        where.name = {
            contains: params.name,
        };
    }
    if (params.userId) {
        where.ownerId = params.userId;
    }

    const data = await prisma.space.findMany({
        skip: page * size,
        take: size,
        where: where,
        include: {
            SpaceImage: true,
        },
    });

    const count = await prisma.space.count({
        where: where,
    });

    if (!data) throw new Error('spaces not found');

    return { data, count };
};

const getSpaceById = async (id) => {
    const data = await prisma.space.findUnique({
        where: { id },
    });

    if (!data) {
        throw new Error('space not found');
    }

    return data;
};

const updateSpace = async (id, body) => {
    try {
        const data = await prisma.space.update({
            where: { id },
            data: body,
        });

        return data;
    } catch (error) {
        throw error;
    }
};

const deleteSpace = async (id) => {
    try {
        const data = await prisma.space.delete({
            where: { id },
        });

        return data;
    } catch (error) {
        throw error;
    }
};

export default {
    getSpaces,
    getSpaceById,
    createSpace,
    updateSpace,
    deleteSpace,
    createSpaceWithImage,
};
