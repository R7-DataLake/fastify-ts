import { Knex } from 'knex';

export class UserModel {

  constructor () { }

  list(db: Knex, query: any, limit: any, offset: any) {

    let sql = db('users as u')
      .select(
        'u.user_id',
        'u.username',
        'u.first_name',
        'u.last_name',
        'u.enabled',
        'u.role'
      )

    if (query) {
      let _query = `%${query}%`
      sql.where(builder => {
        builder.whereRaw('LOWER(u.first_name) like LOWER(?)', [_query])
          .orWhereRaw('LOWER(u.last_name) like LOWER(?)', [_query])
      })
    }

    return sql
      .orderBy('u.first_name')
      .limit(limit).offset(offset);

  }

  listTotal(db: Knex, query: any) {

    let sql = db('users as u')

    if (query) {
      let _query = `%${query}%`
      sql.where(builder => {
        builder.whereRaw('LOWER(u.first_name) like LOWER(?)', [_query])
          .orWhereRaw('LOWER(u.last_name) like LOWER(?)', [_query])
      })
    }

    return sql
      .count({ total: '*' });

  }

  info(db: Knex, userId: any) {
    return db('users')
      .where('user_id', userId)
      .first();
  }

  profile(db: Knex, userId: any) {
    return db('users')
      .where('user_id', userId)
      .first();
  }

  save(db: Knex, data: any) {
    return db('users')
      .insert(data);
  }

  update(db: Knex, userId: any, data: any) {
    return db('users')
      .update(data)
      .where('user_id', userId);
  }

  remove(db: Knex, userId: any) {
    return db('users')
      .where('user_id', userId)
      .del();
  }

}
