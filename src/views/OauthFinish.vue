<template>
  <div>Login finishing...</div>
</template>

<script>
export default {
  name: "OauthFinish",
  methods:{
    async oauthLoginFinish (){
      try{
        let uuid = this.$route.query.uuid;
        let service = this.$route.query.service;
        await this.apiClient.oauthLoginFinish(uuid,service);
        await this.$root.loadUserInfo(1);
        this.error = null;
        if (this.redirect) {
          window.location.assign(this.redirect);
        } else {
          this.$router.push({name: 'home'});
        }
      } catch (e) {
        this.error = "login failed";
      }
      return false;
    }
  },
  /*mounted() {  //created maybe

  },*/
  created() {
    this.apiClient = this.$root.apiClient;
    this.oauthLoginFinish();
  }
}
</script>

<style scoped>

</style>
