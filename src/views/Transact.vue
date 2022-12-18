<template>
  <div class="module">
    <el-row type="flex" justify="space-between" align="middle" :style="`height: 100%; min-height: 600px;`">
      <el-col :span="8">
        <div class="card card-box" v-for="(info, index) in infos" :key='info.title + index'>
          <div>
            <BNB :active="true" :fill="defaultColor" v-if="['BNB','ETH'].includes(type)"/>
            <DAI :fill="defaultColor" v-else-if="type == 'DAI'"/>
            <USDT :fill="defaultColor" v-else-if="type == 'USDT'"/>
            <RUBY :fill="defaultColor" v-else-if="type == 'RUBY'"/>
          </div>
          <el-row type="flex" justify="space-between" align="middle" style="width: 100%;">
            <el-col :span="12">
              <div class="title white-font">{{info.title}}</div>
              <span class="subtitle gray-font" v-if="info.subtitle">{{info.subtitle}}</span>
            </el-col>
            <div class="center-text">
              <span class="value white-font">{{info.value}}</span>
              <span class="white-font" v-if="info.value.toString().split(':').length==1"> Unit</span>
            </div>
          </el-row>
        </div>
      </el-col> 
      <el-col :span="16" style="margin-left: 20px;">
        <div class="card-box tx-box">
          <div class="tx-header">
            <span class="tx-title white-font">Mint</span>
            <span class="subtitle gray-font">Deposit {{type}} to p{{type}}</span>
          </div>
          <div class="tx-form">
            <el-row type="flex" justify="space-between" align="middle">
              <el-col>
                <r-input v-model="input.mint" placeholder="0 Unit" :noMax="true"></r-input>
              </el-col>
                <r-button style="width: 150px;" @click.native="txMint">Confirm Mint</r-button>
            </el-row>
          </div>
        </div>
        <div class="card-box tx-box">
          <div class="tx-header">
            <span class="tx-title white-font">Transfer</span>
            <span class="subtitle gray-font my-address" :data-clipboard-text="accountAddress" @click="copy">Copy My Ruby Account Address</span>
          </div>
          <div class="tx-form">
            <el-row type="flex" justify="space-between" align="middle">
              <el-col>
                <el-row type="flex" justify="space-between" align="middle">
                  <el-col>
                    <r-input v-model="input.transfer" placeholder="0 Unit" @max="setMax('transfer')"></r-input>
                  </el-col>
                  <el-col>
                    <r-input v-model="input.remoteAddress" :noIcons="true" style="width: 200px;" placeholder="Remote Address"></r-input>
                  </el-col>
                </el-row>
              </el-col>
                <r-button style="width: 150px;" @click.native="transfer">Confirm Transfer</r-button>
            </el-row>
          </div>
        </div>
        
        <div class="card-box tx-box">
          <div class="tx-header">
            <span class="tx-title white-font">Redeem</span>
            <span class="subtitle gray-font">Redeem p{{type}} to {{type}}</span>
          </div>
          <div class="tx-form">
            <el-row type="flex" justify="space-between" align="middle">
              <el-col>
                <r-input v-model="input.redeem" placeholder="0 Unit" @max="setMax('redeem')"></r-input>
              </el-col>
              <r-button style="width: 150px;" @click.native="txRedeem">Confirm Redeem</r-button>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {Col, Row} from "element-ui"
import {BNB, DAI, USDT, RUBY} from "@/components/svg/index.js"
import Button from "@/components/Button.vue"
import Input from "@/components/Input.vue"
import Clipboard from 'clipboard'
export default {
  async mounted() {
    this.$showLoading('Get account information...')
    await this.$store.dispatch('getBalance')
    this.$hideLoading()
  },
  components: {
    ElCol: Col,
    ElRow: Row,
    BNB,
    DAI,
    USDT,
    RUBY,
    RButton: Button,
    rInput: Input,
  },
  data() {
    return {
      defaultColor: '#FF001D',
      input: {
        mint: "",
        transfer: "",
        remoteAddress: "",
        redeem: ""
      }
    }
  },
  computed: {
    infos() {
      return [
        {
          title: `Ruby ${this.type} Balance`,
          subtitle: `Ruby ${this.type}(=${this.rubyBalance / 100}${this.type})`,
          value: this.rubyBalance
        },
        {
          title: `${this.type} Balance`,
          subtitle: `${this.type}(=${this.mateMaskBalance}${this.type})`,
          value: this.mateMaskBalanceUnit
        },
        {
          title: `Ruby ${this.type} Balance`,
          subtitle: `${this.type} : Ruby ${this.type}`,
          value: '1:100'
        }
      ]
    },
    ...mapState({
      rubyBalance: state => state.rubyBalance ,
      mateMaskBalance: state =>state.mateMaskBalance,
      mateMaskBalanceUnit: state => Math.floor(state.mateMaskBalance * 100),
      accountAddress: state => state.rubyAddress ,
      type: state => state.type
    }),
  },
  methods: {
    async txMint() {
      if (!this.input.mint) return
        switch(this.type) {
          case 'ETH':
          case 'BNB': {
            await this.$switchNetwork()
              this.$showLoading('In execution...')
              try {
                  await this.$ruby.rubyEthDeposit(this.input.mint)
              } catch (error) {
                  if (error) {
                     this.$message(error);
                     this.$hideLoading()
                     return  
                  }
                  this.$message('Something Went Wrong.')
                  console.error(error)
              }
              this.$hideLoading()
              break
          }
          default: {
            this.$message('Unsupported cryptocurrency type')
          }
        }
      this.input.mint = ''
      this.$store.dispatch('getBalance')
    },
    async txRedeem() {
      if (!this.input.redeem) return
        switch(this.type) {
          case 'ETH':
          case 'BNB': {
            await this.$switchNetwork()
              this.$showLoading('In execution...')
              try {
                  await this.$ruby.rubyEthWithdraw(this.input.redeem)
              } catch (error) {
                  if (error) {
                     this.$message(error);
                     this.$hideLoading()
                     return  
                  }
                  this.$message('Something Went Wrong.')
                  console.errror(error)
              }
              this.$hideLoading()
              break
          }
          default: {
            this.$message('Unsupported cryptocurrency type')
          }
        }
      this.input.redeem = ''
      this.$store.dispatch('getBalance')
    },
    async transfer() {
      if (!this.input.remoteAddress) {
        this.$message({type: 'warning', message: 'Need Receiver\'s Address'})
        return
      }
      // let confirm = await MessageBox.confirm('Are You Sure To Transfer?', 'Tips', {
      //   confirmButtonText: 'Confirm',
      //   cancelButtonText: 'Cancel',
      //   customClass: 'ruby-messagebox'
      // })
      // if (confirm == false) return
      
      try {
        switch(this.type) {
          case 'ETH':
          case 'BNB': {
            await this.$switchNetwork()
              this.$showLoading('In execution...')
              try {
                  await this.$ruby.rubyEthTransfer(this.input.remoteAddress, this.input.transfer)
              } catch (error) {
                  if (error) {
                     this.$message(error);
                     this.$hideLoading()
                     return  
                  }
                  this.$message('Something Went Wrong.')
                  console.error(error)
              }
              this.$hideLoading()
              break
          }
          default: {
            this.$message('Unsupported cryptocurrency type')
          }
        }
        this.input.transfer = ''
        this.input.remoteAddress = ''
        this.$store.dispatch('getBalance')
        this.$message({
          type: 'success',
          message: 'Success!'
        });
      } catch (error) {
        console.log('error')
      }
    },
    copy() {
      const clipboard = new Clipboard('.my-address')
      clipboard.on('success', () => {
        this.$message('Copy Successful, Press Ctrl+V to Paste')
        //  释放内存
        clipboard.destroy()
      })
       clipboard.on('error', () => {
        this.$message('The browser does not support replication')
        //  释放内存
        clipboard.destroy()
      })
    },
    setMax(txType) {
      if(txType == 'transfer') {
        this.input.transfer = this.rubyBalance
      }
      else if (txType == 'redeem') {
        this.input.redeem = this.rubyBalance
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my-address:hover {
  color: #FF001D;
  border-bottom: 1px solid #FF001D;
  cursor: pointer;
}
.module {
  height: 100%;
  padding: 0 100px;
  box-sizing: border-box;
  max-width: 1400px;
  margin: auto;
  font-family: 'Exo';
}
.card-box {
  box-sizing: border-box;
  margin: 20px 0px;
  padding: 10px;
  width: 100%;
  height: 150px;
}
.title {
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
}
.value {
  font-family: 'Exo';
  font-style: normal;
  font-weight: 500;
  font-size: 48px;
}
.subtitle {
  font-size: 11px;
}
.tx-title {
  margin-right: 10px;
  font-family: 'Exo';
  font-weight: 700;
  font-size: 24px;
}
.tx-box {
  padding: 20px;
  position: relative;
  border-top: 1px solid #FF001D;
  background: linear-gradient(180deg, #000000, #460202);
}
.tx-form {
  margin-top: 40px;
}
</style>