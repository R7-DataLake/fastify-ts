import { Knex } from 'knex';
export class LoginService {
	checkLogin(db: Knex, username: any) {
		return db('users')
			.select('user_id', 'username', 'password', 'role')
			.where('username', username)
			.first();
	}
}
