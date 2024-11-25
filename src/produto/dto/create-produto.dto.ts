import { ApiProperty } from '@nestjs/swagger';

export class CreateProdutoDto {
  @ApiProperty({example: 'Produto Show', description: 'nome do produto cadastrado'})
  nome: string;

  @ApiProperty({example: 'Descrição Show', description: 'descrição do produto cadastrado'})
  // eslint-disable-next-line prettier/prettier
  descricao?: string;
}
