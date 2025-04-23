// app/controllers/BaseController.ts
import type { HttpContext } from '@adonisjs/core/http'
import { apiResponse } from '#utils/response'

export default class BaseController {
  success(ctx: HttpContext, data: any, message = 'Operacao realizada com sucesso.') {
    return ctx.response.ok(apiResponse(true, message, data))
  }

  created(ctx: HttpContext, data: any, message = 'Recurso criado com sucesso.') {
    return ctx.response.created(apiResponse(true, message, data))
  }

  badRequest(ctx: HttpContext, message = 'Requisicao invalida.', errors?: any) {
    return ctx.response.badRequest(apiResponse(false, message, errors))
  }

  unauthorized(ctx: HttpContext, message = 'Nao autorizado.') {
    return ctx.response.unauthorized(apiResponse(false, message))
  }

  notFound(ctx: HttpContext, message = 'Recurso nao encontrado.') {
    return ctx.response.notFound(apiResponse(false, message))
  }

  internalError(ctx: HttpContext, message = 'Erro interno no servidor.', errors?: any) {
    return ctx.response.internalServerError(apiResponse(false, message, errors))
  }
}
