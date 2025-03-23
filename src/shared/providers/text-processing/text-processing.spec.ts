import { Test, TestingModule } from '@nestjs/testing';
import { TextProcessing } from './text-processing.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import axios from 'axios';
import { TextProcessingSentimentEnum } from './dto/text-processing-response.dto';
import envVarsSchema from '../../../config/environment.config';
import { formUrlEncoded } from '../../../shared/utils/string';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TextProcessing', () => {
    let provider: TextProcessing;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    validationSchema: envVarsSchema,
                    envFilePath: '.env.test',
                    validationOptions: {
                        abortEarly: false,
                    },
                }),
            ],
            providers: [
                TextProcessing,
            ],
        }).compile();

        provider = module.get<TextProcessing>(TextProcessing);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(provider).toBeDefined();
        expect(configService).toBeDefined();
    });

    it('should call the sentiment API and return the pos label', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                label: TextProcessingSentimentEnum.POS, // Resultado fictício
            },
        });

        const result = await provider.getSentiment('Texto de teste');
        expect(result).toBe(TextProcessingSentimentEnum.POS);

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'http://mocked-api-host/api/sentiment/',
            formUrlEncoded({ text: 'Texto de teste' }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
    });


    it('deve lançar erro se a API de sentimento falhar', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

        await expect(provider.getSentiment('Texto de teste')).rejects.toThrow('Error while getting sentiment from text processing API.');
    });
});