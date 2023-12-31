import { applyDecorators } from '@nestjs/common';
import { TokensDto } from '../dto/tokens.dto';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiResponseData } from '@shared/docs';
import { RefreshDto } from '../dto/refresh.dto';

export const ApiRefresh = () =>
  applyDecorators(
    ApiOkResponse(),
    ApiResponseData(TokensDto),
    ApiOperation({ summary: 'Refresh access token' }),
    ApiBody({ type: RefreshDto }),
  );
