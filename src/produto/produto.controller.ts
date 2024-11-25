import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { CompraProdutoDto } from './dto/compra-produto.dto';
import { VendaProdutoDto } from './dto/venda-produto.dto';
import { Operacao, Produto } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Produto')
@Controller('produto')
export class ProdutoController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna uma lista de produtos' })
  @ApiResponse({ status: 200, description: 'Sucesso' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  buscarTodos(): Promise<Produto[]> {
    return this.produtoService.buscarTodos();
  }

  @Post()
  criar(@Body() createProdutoDto: CreateProdutoDto): Promise<Produto> {
    return this.produtoService.criar(createProdutoDto);
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string): Promise<Produto> {
    return this.produtoService.buscarPorId(+id);
  }

  @Patch(':id')
  atualizar(
    @Param('id') id: string,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    return this.produtoService.atualizar(+id, updateProdutoDto);
  }

  @Delete(':id')
  desativar(@Param('id') id: string): Promise<Produto> {
    return this.produtoService.desativar(+id);
  }

  @Post(':id/comprar')
  comprarProdutos(
    @Body() compraProdutoDto: CompraProdutoDto,
    @Param('id') id: string,
  ): Promise<Operacao> {
    return this.produtoService.comprarProdutos(+id, compraProdutoDto);
  }

  @Post(':id/vender')
  venderProdutos(
    @Body() vendaProdutoDto: VendaProdutoDto,
    @Param('id') id: string,
  ): Promise<Operacao> {
    return this.produtoService.venderProdutos(+id, vendaProdutoDto);
  }
}
