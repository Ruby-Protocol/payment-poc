<template>
    <div class="module">
      <el-row type="flex" justify="space-between" align="middle" :style="`height: 100%; min-height: 600px;`">
        <el-col :span="10">
        <!-- 中间文字 -->
          <div class="description">
            <div class="front-text">
              Choose Which <br>cryptocurrency you want to <span>privately transfer</span> via Ruby
            </div>
            <!-- <div class="btn"> -->
            <!-- <a href="https://docs.ruby.network/tutorial/mainnet-configuration" target="blank"> -->
            <a href="https://ruby-docs.gitbook.io/ruby-protocal/tutorial/connect-your-wallet" target="_blank">
              <!-- <img class="btn" src="../assets/images/check-tutorial.png" alt="" srcset=""> -->
              <div class="check-tutorial">
                <img class="left border" src="../assets/icon/left.svg" alt="" srcset="">
                <div>Check Tutorial</div>
                <img class="right border" src="../assets/icon/right.svg" alt="" srcset="">
              </div>
            </a>
            <!-- </div> -->
          </div>
        </el-col>
        <el-col span="">
        <!-- 右部组件 -->
          <div class="right-card">
            <card style="margin: 15px 0px;" v-for="(card,index) in cardList" :key="index"
            :text="card.text" :content="card.content" :logo="card.logo"
            @click.native="selectToken(card.text)"/>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import {Col, Row} from "element-ui"
import Card from '../components/Card';
export default {
  name: 'Home',
  data() {
    return {
      cardList: [
        {
          text: 'ETH',
          content: 'Transfer ETH to pETH',
          logo: 'BNB'
        },
        {
          text: 'DAI',
          content: 'Transfer DAI to pDAI',
        },
        {
          text: 'USDT',
          content: 'Transfer USDT to pUSDT',
        },
        {
          text: 'RUBY',
          content: 'Transfer RUBY to pRUBY',
        }
      ],
    };
  },
  methods: {
    async selectToken(text) {
      if (!this.$ruby.rubyClient) {
         try {
             await this.initRubyClient();
         } catch (error) {
             this.$message('Connect wallet Error');
             console.error(error);
         }
      }
      this.$store.commit('setType', text);
      switch(text) {
          case 'ETH':
          case 'BNB': {
            await this.$switchNetwork()
              this.$showLoading('init client...')
              try {
                  await this.$ruby.initRubyEthClient();
                  this.$showLogin()
              } catch (error) {
                  this.$message(error.message)
                  console.error(error)
              }
              this.$hideLoading()
              // this.$router.push('/login')
              break;
          }
          default: {
              this.$message('Coming Soon!')
          }
      }
    }
  },
  components: {
    Card,
    ElCol: Col,
    ElRow: Row
  }
};
</script>
<style lang="less" scoped>
.module {
  height: 100%;
  padding: 0 100px;
  box-sizing: border-box;
  max-width: 1400px;
  margin: auto;
  background-color: transparent;
  background-image: url('../assets/images/cube.png');
  background-repeat: no-repeat;
  background-position: right;
  background-size: contain;
}
.description {
  width: 100%;
}
.front-text {
  font-family: EXO;
  font-size: 40px;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: 60px;
  letter-spacing: normal;
  color: #ffffff;
}
a {
  text-decoration: none;
  color: white;
}
.check-tutorial {
  margin-top: 10px;
  &:hover {
    .left {
      transition: all .3s;
      margin-left: 10px;
      transform: scale(0.9);
    }
    .right {
      transition: all .3s;
      margin-left: 0px;
      transform: scale(0.9);
    }
    div {
      transition: all .3s;
      margin-left: 0px;
    }
  }
  div {
    height: 30px;
    line-height: 30px;
    width: 130px;
    display: inline-block;
    text-align: center;
    margin-left: 10px;
    font-weight: 700;
  }
  .border {
    position: relative;
    top: 9px;
    width: 13.65px;
    height: 30px;
  }
  .right {
    margin-left: 10px;
  }
}

.right-card {
  width: 100%;
  justify-content: space-between;
}
.btn{
  cursor: pointer;
  margin-top: 30px;
}
</style>
