import S from 'fluent-json-schema'

const schema = S.object()
  .prop('userId', S.string().format('uuid').required())

export default {
  params: schema
}