import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { TokensDto } from '../dto/tokens.dto';
import { Provider } from '@prisma/client';
import { ApiAuthGoogleLogin } from './api-auth-google-login.decorator';
import { ApiAuth } from '../docs/api-auth.decorator';
import { Prefix } from '@utils/prefix.enum';

@ApiAuth()
@Controller(Prefix.AUTH_GOOGLE)
export class AuthGoogleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: AuthGoogleService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiAuthGoogleLogin()
  async login(@Body() loginDto: AuthGoogleLoginDto): Promise<TokensDto> {
    const socialData = await this.authGoogleService.getProfileByToken(loginDto);

    return this.authService.validateSocialLogin(Provider.GOOGLE, socialData);
  }
}
