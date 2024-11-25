import {
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { Operacao, Produto } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompraProdutoDto } from './dto/compra-produto.dto';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { VendaProdutoDto } from './dto/venda-produto.dto';

@Injectable()
export class ProdutoService {
  // eslint-disable-next-line prettier/prettier
  constructor(private prisma: PrismaService) {}

  async buscarTodos(): Promise<Produto[]> {
    //método que retorna todos os produtos com status ativo (true)
    const produtos = await this.prisma.produto.findMany({
      where: { status: true },
    });
    if (!produtos)
      throw new InternalServerErrorException(
        'Não foi possível buscar os produtos.',
      );
    return produtos;
  }

 

  async criar(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    //desenvolver método que cria um novo produto, retornando o produto criado
    const produtoCriado = await this.prisma.produto.create({
      data: createProdutoDto,
    });
    if (!produtoCriado) {
      throw new InternalServerErrorException('Não foi possível criar produto');
    }
    return produtoCriado;
  }

  async buscarPorId(id: number): Promise<Produto> {
    const produtoPeloId = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        operacoes: true, // inclui as operações do produto
      },
    });
    //desenvolver método para retornar o produto do id informado, com os respectivos dados de operações
    if (!produtoPeloId) {
      throw new InternalServerErrorException(
        'Não foi possível encontrar produto',
      );
    }
    return produtoPeloId;
  }

  async atualizar(
    id: number,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    const produtoAtualizado = await this.prisma.produto.update({
      where: { id },
      data: updateProdutoDto,
    });

    if (!produtoAtualizado) {
      throw new InternalServerErrorException(
        'Não foi possível atualizar produto',
      );
    }
    //desenvolver método para atualizar os dados do produto do id informado, retornando o produto atualizado
    return produtoAtualizado;
  }

  async desativar(id: number): Promise<Produto> {
    const produtoDesativado = await this.prisma.produto.update({
      where: { id },
      data:{
        status:false
      }
    })
    if (!produtoDesativado) {
      throw new InternalServerErrorException('Não foi possível desativar produto');
    }
    //desenvolver método para desativar o produto, mudar o status para false
    return produtoDesativado
  }


  //desenvolver método que executa a operação de compra, retornando a operação com os respectivos dados do produto
    //tipo: 1 - compra, 2 - venda
    //o preço de venda do produto deve ser calculado a partir do preço inserido na operacao, com uma margem de 50% de lucro
    //caso o novo preço seja maior que o preço de venda atual, o preço de venda deve ser atualizado, assim como o preço de compra
    //calcular o valor total gasto na compra (quantidade * preco)
    //deve também atualizar a quantidade do produto, somando a quantidade comprada

  async comprarProdutos(
    id: number,
    compraProdutoDto: CompraProdutoDto,
  ): Promise<Operacao> {
    const tipo = 1;
  

    
    const {preco, quantidade, data} = compraProdutoDto


  const produtoComprado = await this.buscarPorId(id)

  function getPreco(precoAtual:number, precoCadastrado:number){
    if(precoAtual>precoCadastrado){
      return precoAtual
    }else{
      return precoCadastrado
    }
  }

  const novoPreco = getPreco(preco, produtoComprado.precoCompra)
    await this.prisma.produto.update({
      where:{id:id},
      data:{
        precoCompra: novoPreco,
        precoVenda: novoPreco * 1.5,
        quantidade: quantidade + produtoComprado.quantidade,
      }
    })

    const compra = await this.prisma.operacao.create({
      data:{
        preco: preco,
        quantidade:quantidade,
        tipo:tipo,
        data:data,
        total: quantidade*preco,
        produtoId:id
      },   
      include:{
        produto:true
      }
    })
    console.log(compra)
    if(!compra){
      throw new InternalServerErrorException('Não foi possível comprar produto')
    }

    return compra


 
  }

  async venderProdutos(
    id: number,
    vendaProduto: VendaProdutoDto,
  ): Promise<Operacao> {
    const tipo = 2;

     const produtovendido = await this.buscarPorId(id)
     const {quantidade, data} = vendaProduto

     function getPrecoCompra(quantidade:number){
      if(quantidade<=0){
        return 0
      }else{
        return produtovendido.precoCompra
      }
     }

      function getPrecoVenda(quantidade:number){
      if(quantidade<=0){
        return 0
      }else{
        return produtovendido.precoVenda
      }
     }

     const newPrecoCompra = getPrecoCompra(produtovendido.quantidade - quantidade)
    const newPrecoVenda = getPrecoVenda(produtovendido.quantidade - quantidade)
    const novaQuantidade = (produtovendido.quantidade - quantidade) <= 0 ? 0 : produtovendido.quantidade - quantidade

    const novaQuantidadeVenda = (produtovendido.quantidade - quantidade) <= 0 ? produtovendido.quantidade  :  quantidade

     await this.prisma.produto.update({
      where:{id:id},
      data:{
        quantidade:  novaQuantidade,
        precoCompra: newPrecoCompra,
        precoVenda: newPrecoVenda
      }
    })
      const venda = await this.prisma.operacao.create({
      data:{
        preco: produtovendido.precoVenda,
        quantidade:novaQuantidadeVenda,
        tipo:tipo,
        data:data,
        total: novaQuantidadeVenda*produtovendido.precoVenda,
        produtoId:id
      },
      include:{produto:true}      
    })


    if(!venda){
      throw new InternalServerErrorException('Não foi possível vender produto')
    }

    return venda

    //desenvolver método que executa a operação de venda, retornando a venda com os respectivos dados do produto
    //tipo: 1 - compra, 2 - venda
    //calcular o valor total recebido na venda (quantidade * preco)
    //deve também atualizar a quantidade do produto, subtraindo a quantidade vendida
    //caso a quantidade seja esgotada, ou seja, chegue a 0, você deverá atualizar os precoVenda e precoCompra para 0
    
  }
}
