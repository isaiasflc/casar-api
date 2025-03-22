import { Module } from '@nestjs/common';
import { TextProcessing } from './text-processing.provider';

@Module({
  providers: [TextProcessing],
  exports: [TextProcessing],
})
export class TextProcessingModule { }
