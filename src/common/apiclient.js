
const develMode = (window.location.port === '3001'); //development server detection
const flhost = develMode ? 'http://localhost:8088' : ('https://' + window.location.host);

//const JWT_SERVER_ROOT = 'http://localhost:8080/jwt-auth';
const JWT_SERVER_ROOT = flhost + '/jwt-auth';
const JWT_LOGIN = JWT_SERVER_ROOT + '/auth/login';
const JWT_REGISTER = JWT_SERVER_ROOT + '/auth/register';
const JWT_ADMIN = JWT_SERVER_ROOT + '/admin';
const JWT_USER = JWT_SERVER_ROOT + '/user';


export class ApiClient {

	currentRepo = 'default';
	onNotAuthorized = null;


	storeToken(token) {
		localStorage.setItem('jwt', token);
	}

	logout() {
		localStorage.removeItem('jwt');
	}

	checkAuth(response) {
		if (response.status == 401 || response.status == 403) {
			if (this.onNotAuthorized) {
				this.onNotAuthorized();
			}
			return false;
		} else {
			return true;
		}
	}

	headers(headers) {
		const src = headers ? headers : {};
		const token = localStorage.getItem('jwt');
		if (token) {
			return {
				...src,
				'Authorization': ('Bearer ' + token)
			};
		} else {
			return src;
		}
	}

	async getUserInfo() {
		const url = JWT_SERVER_ROOT + '/auth/userInfo';
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data.param;
	}

	async getUsers() {
		const url = JWT_SERVER_ROOT + '/admin/user';
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data;
	}

	async userExists(userid) {
		const url = JWT_SERVER_ROOT + '/auth/checkUserId/' + userid;
		let response = await fetch(url, {
			method: 'GET'
		});
		const data = await response.json();
		return (data.message === 'yes');
	}

	async login(userid, password) {
		const url = JWT_LOGIN;
		try {
			const udata = { username: userid, password: password };
			let response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(udata)
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message);
			}

			const token = data.token;
			this.storeToken(token);

		} catch (e) {
			throw new Error(e);
		}
	}

	async loginOauthGoogle() {
	  return true;
	}

  async loginOauthGithub() {
    return true;
  }


  async register(userdata) {
		const url = JWT_REGISTER;
		try {
			let response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userdata)
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message);
			}

			return true;

		} catch (e) {
			throw new Error(e);
		}
	}

	async updateUser(userdata) { //admin only
		const url = JWT_ADMIN + '/user/' + userdata.username;
		try {
			let response = await fetch(url, {
				method: 'PUT',
				headers: this.headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify(userdata)
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message);
			}

			return data;

		} catch (e) {
			throw new Error(e);
		}
	}

	async updatePassword(userdata, password) { //admin only
		const url = JWT_ADMIN + '/user/' + userdata.username + '/password';
		try {
			let response = await fetch(url, {
				method: 'PUT',
				headers: this.headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({newPassword: password})
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message);
			}

			return data;

		} catch (e) {
			throw new Error(e);
		}
	}

	async deleteUser(userdata) { //admin only
		const url = JWT_ADMIN + '/user/' + userdata.username;
		try {
			let response = await fetch(url, {
				method: 'DELETE',
				headers: this.headers()
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message);
			}

			return data;

		} catch (e) {
			throw new Error(e);
		}
	}

	async updateCurrentUser(userdata) {
		const url = JWT_USER;
		try {
			let response = await fetch(url, {
				method: 'PUT',
				headers: this.headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify(userdata)
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message);
			}

			return data;

		} catch (e) {
			throw new Error(e);
		}
	}

	async updateCurrentUserPassword(oldPassword, newPassword) {
		const url = JWT_USER + '/password';
		try {
			let response = await fetch(url, {
				method: 'PUT',
				headers: this.headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({oldPassword, newPassword})
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message);
			}

			return data;

		} catch (e) {
			throw new Error(e);
		}
	}

	async recoverPassword(userid, captchaToken) {
		const url = JWT_SERVER_ROOT + '/auth/resetPasswordChallenge';
		try {
			let response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({username: userid, captchaToken: captchaToken})
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message);
			}

			return true;

		} catch (e) {
			throw new Error(e);
		}
	}

	async verifyChallenge(hash) {
		const url = JWT_SERVER_ROOT + '/auth/verifyChallenge/' + encodeURIComponent(hash);
		try {
			let response = await fetch(url, {
				method: 'GET',
				headers: {
				},
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message);
			}
			return data;

		} catch (e) {
			throw new Error(e);
		}
	}

	async resetPassword(userdata) {
		const url = JWT_SERVER_ROOT + '/auth/resetPassword';
		try {
			let response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userdata)
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message);
			}

			return true;

		} catch (e) {
			throw new Error(e);
		}
	}

	async getLogEntries() {
		const url = JWT_SERVER_ROOT + '/admin/log';
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data;
	}
}
