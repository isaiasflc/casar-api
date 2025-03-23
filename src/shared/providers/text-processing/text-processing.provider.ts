import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PostTextProcessingSentimentResponse, TextProcessingSentimentEnum } from './dto/text-processing-response.dto';
import { LoggerProvider } from '../logger/logger';
import { AppError } from '../../errors/app-error';
import { ErrorEnum } from '../../errors/app-error.enum';
import { formUrlEncoded } from '../../../shared/utils/string';

@Injectable()
export class TextProcessing {
    private readonly configService: ConfigService;

    constructor() {
        this.configService = new ConfigService();
    }

    public async getSentiment(content: string): Promise<TextProcessingSentimentEnum> {
        try {
            const textProcessingApiHost = this.configService.get<string>('TEXT_PROCESSING_API_HOST');
            const postSentimentUrl = `${textProcessingApiHost}/api/sentiment/`;

            const data = { text: content };

            const response = await axios.post<PostTextProcessingSentimentResponse>(postSentimentUrl, formUrlEncoded(data), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            return response.data.label;
        }
        catch (error) {
            LoggerProvider.loggerError('[TEXT_PROCESSING][GET_SENTIMENT_INFO][UNEXPECTED_ERROR]', error as Error);
            throw new AppError(ErrorEnum.TEXT_PROCESSING_PROVIDER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
