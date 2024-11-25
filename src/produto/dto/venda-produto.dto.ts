/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';


export class VendaProdutoDto {
  @ApiProperty({example: 10, description: 'quantidade do produto à ser vendido'})
  quantidade: number;

  @ApiProperty({example: new Date, description: 'data da venda'})
  data?: Date;
}
