import { createWebHashHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import RecoverPassword from "../views/RecoverPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
import AdminUsers from "../views/AdminUsers.vue";
import AdminLog from "../views/AdminLog.vue";
import OauthFinish from "../views/OauthFinish";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			name: "home",
			path: "/",
			component: Home
		},
		{
			name: "profile",
			path: "/profile",
			component: Profile
		},
		{
			name: "login",
			path: "/login",
			component: Login
		},
		{
			name: "register",
			path: "/register",
			component: Register
		},
		{
			name: "recover",
			path: "/recover",
			component: RecoverPassword
		},
		{
			name: "reset",
			path: "/reset/:hash",
			component: ResetPassword
		},
		{
			name: 'adminUsers',
			path: '/admin/users',
			component: AdminUsers
		},
		{
			name: 'adminLog',
			path: '/admin/log',
			component: AdminLog
		},
    {
      name: 'oauthFinisth',
      path: '/oauth',
      component: OauthFinish
    }
	]
});

export default router;
