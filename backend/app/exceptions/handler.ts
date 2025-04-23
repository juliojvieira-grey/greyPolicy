import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as authErrors } from '@adonisjs/auth'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  async handle(error: any, ctx: HttpContext) {
    if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
      return ctx.response.status(401).send({
        success: false,
        message: 'Credenciais inválidas',
      })
    }

    if (error.code === 'E_INVALID_AUTH_SESSION') {
      return ctx.response.status(401).send({
        success: false,
        message: 'Sessão de autenticação inválida ou expirada',
      })
    }

    if (error.code === 'E_ROW_NOT_FOUND') {
      return ctx.response.status(404).send({
        success: false,
        message: 'Recurso não encontrado',
      })
    }

    if (error.code === 'E_VALIDATION_ERROR') {
      return ctx.response.status(422).send({
        success: false,
        message: 'Erro de validação',
        errors: error.messages || [],
      })
    }

    if (error.code === 'EAI_AGAIN' || error.message?.includes('getaddrinfo')) {
      return ctx.response.status(503).send({
        success: false,
        message: 'Serviço de banco de dados temporariamente indisponível. Tente novamente em instantes.',
      })
    }

    return super.handle(error, ctx)
  }

  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
