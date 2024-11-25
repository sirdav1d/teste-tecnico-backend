import { ApiProperty } from '@nestjs/swagger';

export class CompraProdutoDto {
  @ApiProperty({example: 10, description: 'quantidade do produto à ser comprado'})
  quantidade: number;

  @ApiProperty({example: 100, description: 'preço do produto à ser comprado'})
  preco: number; //preço correspondente a uma unidade

   @ApiProperty({example: new Date, description: 'data da compra'})
  // eslint-disable-next-line prettier/prettier
  data?: Date;
}
