<template>
  <div class="login">
    <div class="login-box">
      <div class="left-form">
        <!--<i class="logo"></i>-->
        <div class="form-box">

          <input type="text" class="username" placeholder="请输入用户名"
                 v-model="form.email" @keyup.enter="submitLogin">

          <input type="password" class="password" placeholder="请输入密码"
                 v-model="form.password" @keyup.enter="submitLogin">


          <el-button type="primary" size="medium"
                     @click="submitLogin">登录
          </el-button>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import config from 'service/config';
  import {Base64} from 'js-base64';
  import md5 from 'blueimp-md5';

  export default {
    name: 'login',
    data() {
      return {
        form: {
          email: '',
          password: '',
        },
      }
    },
    created() {
      // console.log(md5('admin123456'))
      // console.log(md5('admin'))
    },
    mounted() {
    },
    methods: {
      submitLogin() {
        let params = _.clone(this.form);

        // admin  admin123456
        if (md5(params.email) === '21232f297a57a5a743894a0e4a801fc3' && md5(params.password) === 'a66abb5684c45962d887564f08346e8d') {
          console.log(1)
          this.$localStore.set('token', md5(params.password));
          this.$router.push('/');
        } else {
          return this.$message.warning('请输入正确的用户名和密码');
        }


        /*


        this.loading = true;
        params.partnerType = this.query.type;

        this.$ajax.post(this.$apis.post_auth_signin, params)
          .then(data => {
            let expire, url, u;
            expire = new Date(new Date().valueOf() + (24 * 60 * 60 * 1000 * 30));
            u = Base64.decode(this.query.redirect);

            u = u[u.length - 1] !== 'l' ? u.substring(0, u.length - 1) : u;
            url = `${u}?token=${Base64.encode(data.userSessionToken)}`;

            this.$localStore.set('username', this.form.email, expire);
            this.$localStore.set('password', Base64.encode(this.form.password), expire);

            this.$sessionStore.clearAll();
            window.location.href = url;
          })
          .catch(() => {
            this.checkVerificationCode();
            this.refreshVerificationCode();
          })
          .finally((res) => this.loading = false);*/
      }
    }
  }
</script>
<style scoped>
  .login {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: #212224;
  }

  .login-box {
    width: 500px;
    border-radius: 15px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .loginBoxH {
    height: 450px;
  }

  .left-form {
    width: 100%;
    height: 100%;
    background-color: #2e2f31;
    border-radius: 15px;
    padding: 40px 0;
  }

  .logo {
    /*background-image: url("../../assets/images/logo2.png");*/
    width: 168px;
    height: 45px;
    background-size: 100% 100%;
    display: block;
    margin: 65px 0 0 70px;
  }

  .form-box {
    width: 205px;
    margin-left: 52px;
    margin-top: 15px;
    margin: 0 auto;
  }

  .username, .password {
    background-color: #2e2f31;
    border: none;
    width: 100%;
    border-bottom: 1px solid #aaaaaa;
    color: #aaaaaa;
    line-height: 30px;
    margin-top: 20px;
    font-size: 14px;
    transition: all .5s;
  }

  .username:hover,
  .password:hover,
  .identifyingCode:hover,
  .username:focus,
  .password:focus
  .identifyingCode:focus {
    color: #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
  }

  .form-box /deep/ .el-button {
    background-color: #1981f9;
    border-color: #1981f9;
    font-size: 16px;
    width: 100%;
    margin-top: 50px;
    transition: all .5s;
  }

  .form-box /deep/ .el-button:hover {
    background-color: #0663f9;
  }

  .bottom-text {
    font-size: 14px;
    margin-top: 40px;
  }

  .bottom-text span {
    color: #aeaeae;
  }

  .bottom-text a {
    color: #0f84f7;
  }

  .text-box {
    margin: 115px 0px 0 50px;
  }

  .text-box a {
    display: block;
    color: #2e312f;
    font-size: 14px;
    line-height: 20px;
    transition: all .5s;
  }

  .text-box a:hover {
    transform: translate(5px);
  }

  .sign-title {
    font-size: 50px;
    margin-bottom: 20px;
  }

  .back-image {
    /*background-image: url("../../assets/images/login-back.png");*/
    width: 450px;
    height: 76px;
    background-size: 100% 100%;
    position: absolute;
    bottom: 0;
    border-bottom-right-radius: 15px;
  }

  .identifyingCode {
    background-color: #2e2f31;
    border: none;
    width: 50%;
    border-bottom: 1px solid #aaaaaa;
    color: #aaaaaa;
    line-height: 30px;
    margin-top: 20px;
    font-size: 14px;
    transition: all .5s;
  }

  .verificationCode {
    display: inline-block;
    width: 25%;
    height: 30px;
    vertical-align: middle;
    margin: 0 5px;
  }

  .refresh {
    vertical-align: middle;
    display: inline-block;
    font-size: 30px;
    color: #eeeeee;
    cursor: pointer;
  }
</style>
