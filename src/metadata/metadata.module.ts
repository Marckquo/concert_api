import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';

@Module({
  providers: [MetadataService]
})
export class MetadataModule {}
