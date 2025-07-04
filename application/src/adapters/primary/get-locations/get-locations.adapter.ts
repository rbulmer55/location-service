import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { MetricUnit, Metrics } from '@aws-lambda-powertools/metrics';
import { getHeaders, errorHandler, logger, schemaValidator } from '@shared';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { logMetrics } from '@aws-lambda-powertools/metrics/middleware';
import middy from '@middy/core';
import { schema } from './get-locations.schema';
import httpErrorHandler from '@middy/http-error-handler';
import { config } from '@config';
import { Location } from '@models/location';
import { LocationFilterDTO } from '@shared/location/types/location-filters';
import { getLocationsUseCase } from '@use-cases/get-locations';

const tracer = new Tracer();
const metrics = new Metrics();

const stage = config.get('stage');

export const getLocations = async ({
  body,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const locationFilters: LocationFilterDTO = body ? JSON.parse(body) : {};

    schemaValidator(schema, locationFilters);

    const locations: Location[] = await getLocationsUseCase(locationFilters);

    metrics.addMetric('SuccessfulGetLocations', MetricUnit.Count, 1);

    return {
      statusCode: 200,
      body: JSON.stringify(locations),
      headers: getHeaders(stage),
    };
  } catch (error) {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) errorMessage = error.message;
    logger.error(errorMessage);

    metrics.addMetric('GetLocationsError', MetricUnit.Count, 1);

    return errorHandler(error);
  }
};

export const handler = middy(getLocations)
  .use(injectLambdaContext(logger))
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics))
  .use(httpErrorHandler());
