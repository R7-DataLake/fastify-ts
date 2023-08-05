import S from 'fluent-json-schema'

const paramsSchema = S.object()
  .prop('userId', S.string().format('uuid').required())

const bodySchema = S.object()
  .prop('password', S.string().minLength(8).maxLength(100).required())

export default {
  params: paramsSchema,
  body: bodySchema
}