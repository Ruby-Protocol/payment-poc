<template>
  <div class="dialog-box" v-if="show" @click="close">
    <div class="dialog" @click.stop :style="`height: ${!register?370:450}px`">
      <img v-if="!register" class="outline" src="../assets/images/Rectangle.png" alt="">
      <img v-else class="outline" src="../assets/images/Rectangle-register.png" alt="">
      <img class="login" src="../assets/icon/login.png" alt="">
      <!-- Login -->
      <div v-show="!register" class="login-form">
        <div class="label gray-font">Ruby Secret Key</div>
        <input type="text" v-model="account">
      </div>
      <el-row v-show="!register" class="footer" type="flex" justify="space-between" align="middle">
        <el-col class="tip" :span="18">
          <div class="white-font">Don't have an Account? </div>
          <div class="switch-text red-font" @click="toRegist">
            <span>Register</span>
          </div>
        </el-col>
        <r-button style="padding-left: 15px; padding-right: 15px;" @click.native="login">Login</r-button>
      </el-row>
      <!-- Register -->
      <div v-show="register" class="register">
        <div class="tip gray-font" style="margin-top: 20px;">Please use our key generator or use a key that is as random as your Meramask wallet private key as the Ruby account private key, and copy it on paper for safekeeping.</div>
        <div class="tip red-font" style="margin-top: 20px;">Never share your private key with others.</div>
        <div class="tip red-font" style="margin-top: 20px;">This private key is for the access of {{'RUBY-'+this.type}} account. It cannot be used to access any other Ruby account.</div>
        <div class="options">
          <r-button style="width: 100%" @click.native="generatorKey">Private Key Generator</r-button>
          <div class="red-font center-text" style="font-size: 12px; margin: 10px">OR</div>
          <div>
            <input style="width: 55%; box-sizing: border-box; padding: 0 5px;" type="text" v-model="ownKey" placeholder="Pick Your Own Key">
            <r-button style="margin-left:5%; width: 40%" @click.native="registerOwnKey">Register with It</r-button>
          </div>
          
        </div>
        <div class="red-font switch-text" @click="register=false">
          <span class="red-font">Back to Login</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Col, Row} from "element-ui"
import Button from "@/components/Button.vue"
import { generatorBase64Key, downloadScret } from '../utils'
export default {
  components: {
    RButton: Button,
    ElCol: Col,
    ElRow: Row,
  },
  model: {
    prop: 'show',
    event: 'switch'
  },
  props: {
    show: Boolean
  },
  data() {
    return {
      register: false,
      account: '',
      ownKey: ''
    }
  },
  created() {
    console.log(this.type)
  },
  computed: {
    type() {
      return this.$store.state.type
    }
  },
  methods: {
      async registerOwnKey() {
          if (this.ownKey.length < 16) {
              this.$message('Account length must be greater than 16')
              return
          }
          if (!this.$ruby.rubyClient) {
             this.$message("Your Local Client Connection Failed.Please Refresh The Page");
             return
          }
          this.$showLoading('registering...')
          try {
              await this.$ruby.rubyEthRegister(this.ownKey)
          } catch (error) {
              this.$message(error);
              this.$hideLoading()
              return;
          }
          this.$hideLoading()
          downloadScret(this.ownKey, this.type)
          this.register = false
      },
      async generatorKey() {
        const scret = generatorBase64Key()
           this.$showLoading('registering...')
           try {
               await this.$ruby.rubyEthRegister(scret)
           } catch (error) {
                this.$message(error);
                this.$hideLoading();
                return;
           }
           this.$hideLoading()
           downloadScret(scret, this.type)
           this.register = false
      },
      async login() {
          if (!this.account) {
              this.$message('please input scret')
              return 
          }
          if (!this.$ruby.rubyClient) {
             this.$message("Your Local Client Connection Failed.Please Refresh The Page");
             return; 
          }
          this.$showLoading('logining in...')
          try {
            const res = await this.$ruby.rubyEthLogin(this.account);
            if (res == 0) {
                this.$message('Login Successful')
                try {
                    const rubyAddress = await this.$ruby.rubyEthAddress()
                    this.$store.commit('setRubyAddress', rubyAddress)
                } catch (error) {
                    this.account = ''
                    if (error) {
                        this.$message(error);
                        this.$hideLoading()
                        return;
                    }
                    this.$message('Something Went Wrong.')
                    console.error(error)
                }
                this.account = ''
                this.$hideLoading()
                this.$router.push('/tx')
                this.$hideLogin()
            } else if (res == -1) {
                this.$message({type: 'error', message: 'login failed: this ruby account dose not exist'})
                this.account = ''
                this.$hideLoading()
                return
            }
          } catch (error) {
              this.$message(error);
              this.$hideLoading()
              this.account = ''
              return;
          }
      },
    close () {
      this.$emit('switch', false)
    },
    toRegist() {
      if (!this.$ruby.rubyClient) {
         this.$message("Your Local Client Connection Failed.Please Refresh The Page");
         return
      }
      this.register = true
    }
  },
}
</script>

<style lang="less" scoped>
.dialog-box{
  font-family: EXO;
  position: absolute;
  top: 0; right: 0; left: 0; bottom: 0;
  -webkit-backdrop-filter: blur(7px);
  backdrop-filter: blur(7px);
  .dialog {
    border: 1px solid #FF001D;
    border-right: 0;
    border-bottom: 0;
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 370px; height: 370px;
    background-color: rgba(0, 0, 0, 0.7);
    background-image: url('../assets/images/stripe.png');
    background-repeat: no-repeat;
    background-position: right top;

    padding: 30px;
    .outline {
      z-index: -1;
      position: fixed;
      left: 0px; top: -1px;
      pointer-events: none;
    }
    .login-form {
      margin-top: 110px;
      .label {
        font-size: 12px;
        padding-bottom: 7px;
      }
    }
    input {
      box-sizing: border-box;
      border: 1px solid #FF001D;
      width: 100%;  height: 35px;
      padding: 0 5px;
      text-decoration: none;
      background: transparent;
      outline: none;
      color: white;
      font-weight: 400;
      font-size: 14px;
      line-height: 1.5em;
    }
  }
}
.register {
  font-family: EXO;
  .tip {
    font-size: 10px;
  }
  .options {
    margin: 20px 0;
  }
}
.footer {
  position: absolute;
  bottom: 30px;
  width: 309px;
  .tip {
    font-size: 12px;
  }
}
.switch-text {
  font-size: 10px;
  cursor: pointer;
  span:hover {
    border-bottom: 1px solid #FF001D;
  }
}
</style>