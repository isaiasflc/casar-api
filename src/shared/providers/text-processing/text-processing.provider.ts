import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PostTextProcessingSentimentResponse, TextProcessingSentimentEnum } from './dto/text-processing-response.dto';

@Injectable()
export class TextProcessing {
    private readonly configService: ConfigService;

    constructor() {
        this.configService = new ConfigService();
    }

    public async getSentiment(content: string): Promise<TextProcessingSentimentEnum> {
        const textProcessingApiHost = this.configService.get<string>('TEXT_PROCESSING_API_HOST');
        const postSentimentUrl = `${textProcessingApiHost}/api/sentiment/`;
        const response = await axios.post<PostTextProcessingSentimentResponse>(postSentimentUrl, {
            text: content,
        });
        return response.data.label;
    }
}
