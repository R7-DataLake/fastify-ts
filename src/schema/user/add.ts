import S from 'fluent-json-schema'

const schema = S.object()
  .prop('username', S.string().maxLength(50).required())
  .prop('password', S.string().maxLength(50).minLength(4).required())
  .prop('firstName', S.string().maxLength(100).required())
  .prop('lastName', S.string().maxLength(100).required())
  .prop('enabled', S.enum(['Y', 'N']).default('Y'))
  .prop('role', S.enum(['ADMIN', 'USER']).default('USER').required())

export default {
  body: schema
}