import { Module } from '@nestjs/common';
import { CustomerController } from './customer/customer.controller';
import { CustomerService } from 'src/services/customer/customer.service';

@Module({
  controllers: [CustomerController],
  providers: [
    {
      provide: 'customer',
      useClass: CustomerService,
    },
  ],
})
export class CustomerModule {}
