import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const ActivityDto = z
  .object({
    id: z.number().int(),
    date: z.string().datetime({ offset: true }),
    name: z.string().nullable(),
    location: z.string().nullable(),
    latitude: z.number(),
    longitude: z.number(),
    startTime: z.string().datetime({ offset: true }),
    endTime: z.string().datetime({ offset: true }),
  })
  .partial();
const ItineraryDto = z
  .object({
    id: z.number().int(),
    title: z.string().nullable(),
    image: z.instanceof(File).nullable(),
    imageUrl: z.string().nullable(),
    startDate: z.string().datetime({ offset: true }),
    endDate: z.string().datetime({ offset: true }),
    userId: z.number().int(),
    activities: z.array(ActivityDto).nullable(),
  })
  .partial();

export const schemas = {
  ActivityDto,
  ItineraryDto,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/add",
    alias: "postAdd",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ItineraryDto,
      },
    ],
    response: z.number().int(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/addActivity",
    alias: "postAddActivity",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ActivityDto,
      },
      {
        name: "itineraryId",
        type: "Query",
        schema: z.number().int(),
      },
    ],
    response: z.number().int(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/delete/:itineraryId",
    alias: "deleteDeleteItineraryId",
    requestFormat: "json",
    parameters: [
      {
        name: "itineraryId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Not Found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/itineraries",
    alias: "getItineraries",
    requestFormat: "json",
    response: z.array(ItineraryDto),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/itinerary/:itineraryId",
    alias: "getItineraryItineraryId",
    requestFormat: "json",
    parameters: [
      {
        name: "itineraryId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: ItineraryDto,
    errors: [
      {
        status: 404,
        description: `Not Found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "put",
    path: "/update/:itineraryId",
    alias: "putUpdateItineraryId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ItineraryDto,
      },
      {
        name: "itineraryId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Not Found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/upload-image",
    alias: "postUploadImage",
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ file: z.instanceof(File) }).passthrough(),
      },
    ],
    response: z.string(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
