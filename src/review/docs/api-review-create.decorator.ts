import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiResponseData } from 'src/common/docs/data-response-api.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { Review } from '../entities/review.entity';

export const ApiReviewCreate = () =>
  applyDecorators(
    ApiResponseData(Review, HttpStatus.CREATED),
    ApiOperation({ summary: 'Add new review to db' }),
  );
