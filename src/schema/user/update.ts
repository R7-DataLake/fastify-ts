import S from 'fluent-json-schema'

const paramsSchema = S.object()
  .prop('userId', S.string().format('uuid').required())

const bodySchema = S.object()
  .prop('firstName', S.string().maxLength(100).required())
  .prop('lastName', S.string().maxLength(100).required())
  .prop('enabled', S.enum(['Y', 'N']).default('Y'))
  .prop('role', S.enum(['ADMIN', 'USER']).default('USER').required())

export default {
  params: paramsSchema,
  body: bodySchema
}