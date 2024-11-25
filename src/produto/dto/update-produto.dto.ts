/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoDto } from './create-produto.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProdutoDto extends PartialType(CreateProdutoDto) {
  @ApiProperty({example: 100, description: 'preço de compra do produto'})
  precoCompra?: number;

  @ApiProperty({example: 150, description: 'preço de venda do produto'})
  precoVenda?: number;

  @ApiProperty({example: true, description: 'indica se o produto está ativo no estoque'})
  status?: boolean;

  @ApiProperty({example: 10, description: 'quantidade do produto em estoque'})
  quantidade?: number;
}
