import { TokenProviderService } from './token-provider.service';
export declare class JwtTokenProviderService implements TokenProviderService {
    generateToken<PayloadType extends object = {}>(payload: PayloadType, expiresIn?: string, secret?: string): string;
    verifyAndDecodeToken<PayloadType extends object = {}>(token: string, secret?: string): PayloadType;
    decodeToken<PayloadType extends object = {}>(token: string): PayloadType;
}
