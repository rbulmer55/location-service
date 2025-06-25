import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { MetricUnit, Metrics } from '@aws-lambda-powertools/metrics';
import { getHeaders, errorHandler, logger, schemaValidator } from '@shared';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { logMetrics } from '@aws-lambda-powertools/metrics/middleware';
import middy from '@middy/core';
import { LocationDTO } from '@dto/location';
import { ValidationError } from '@errors/validation-error';
import { createLocationUseCase } from '@use-cases/create-location';
import { schema } from './create-location.schema';
import httpErrorHandler from '@middy/http-error-handler';
import { config } from '@config';
import { Location } from '@models/location';

const tracer = new Tracer();
const metrics = new Metrics();

const stage = config.get('stage');

export const createLocation = async ({
  body,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!body) throw new ValidationError('no payload body');

    const location = JSON.parse(body) as Location;

    schemaValidator(schema, location);

    const created: Location = await createLocationUseCase(location);

    metrics.addMetric('SuccessfulCreateLocation', MetricUnit.Count, 1);

    return {
      statusCode: 200,
      body: JSON.stringify(created),
      headers: getHeaders(stage),
    };
  } catch (error) {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) errorMessage = error.message;
    logger.error(errorMessage);

    metrics.addMetric('CreateLocationError', MetricUnit.Count, 1);

    return errorHandler(error);
  }
};

export const handler = middy(createLocation)
  .use(injectLambdaContext(logger))
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics))
  .use(httpErrorHandler());
