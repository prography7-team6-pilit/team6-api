import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entity/job.entity';
import { Pill } from './entity/pill.entity';
import { User } from './entity/user.entity';
import { RepositoryService } from './repo.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Job,User,Pill]),
],
  providers: [RepositoryService],
  exports:[RepositoryService]
})
export class RepositoryModule {}
