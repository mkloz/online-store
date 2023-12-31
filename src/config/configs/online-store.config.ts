import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ConfigValidator } from '../config.validator';
import { registerAs } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Env, IStore } from '../config.interface';
const { env } = process;

export class OnlineStoreVariables {
  @IsEnum(Env)
  NODE_ENV: Env;

  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsUrl({ require_tld: false })
  FRONTEND_URL: string;

  @IsUrl({ require_tld: false })
  BACKEND_URL: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  JWT_ACCESS_TOKEN_SECRET?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  JWT_ACCESS_TOKEN_TIME: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_SECRET?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_TIME: string;

  @IsString()
  @IsNotEmpty()
  ADMIN_NAME: string;

  @IsString()
  @IsNotEmpty()
  ADMIN_EMAIL: string;

  @IsString()
  @Length(8, 20)
  @Matches(/(?=.*?[A-Z])/, {
    message: 'Missing a upper case leters in pasword',
  })
  @Matches(/(?=.*?[a-z])/, {
    message: 'Missing a lower case leters in pasword',
  })
  @Matches(/(?=.*?[0-9])/, {
    message: 'Missing a numbers in pasword',
  })
  @Matches(/(?=.*?[#?!@$%^&*-])/, {
    message: 'Missing a special charecters in pasword',
  })
  ADMIN_PASSWORD: string;

  @IsInt()
  @IsOptional()
  THROTTLE_TTL: number;

  @IsInt()
  @IsOptional()
  THROTTLE_LIMIT: number;
}

export const onlineStoreConfig = registerAs<IStore>('onlineStore', () => {
  ConfigValidator.validate(env, OnlineStoreVariables);

  return {
    env: env.NODE_ENV as Env,
    port: +(env.PORT || 3000),
    backendUrl: env.BACKEND_URL || '',
    frontendUrl: env.FRONTEND_URL || '',
    jwt: {
      accessToken: {
        secret: env.JWT_ACCESS_TOKEN_SECRET || randomUUID(),
        time: env.JWT_ACCESS_TOKEN_TIME || '15m',
      },
      refreshToken: {
        secret: env.JWT_REFRESH_TOKEN_SECRET || randomUUID(),
        time: env.JWT_REFRESH_TOKEN_TIME || '7d',
      },
    },
    admin: {
      name: env.ADMIN_NAME || '',
      email: env.ADMIN_EMAIL || '',
      password: env.ADMIN_PASSWORD || '',
    },
    throttle: {
      ttl: +(env.THROTTLE_TTL || 50),
      limit: +(env.THROTTLE_LIMIT || 10),
    },
  };
});
