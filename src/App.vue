<template>
  <div id="app" ref="app">
    <header-nav ref="header" class="nav" bgColor="black"></header-nav>
    <div ref="main" class="main" style="position: absolute; top: 106px; bottom: 26px; width: 100%;">
      <router-view/>
    </div>
    <div ref="footer" style="background: black; position: fixed; bottom: 0px; left: 0px; width: 100%; height: 26px;">
      <img style="width: 100%; height: 100%;" src="./assets/images/footer.png" alt="">
    </div>
    <r-login v-model="showDialog"></r-login>
  </div>
</template>

<script>
import Vue from 'vue'
import { Loading } from 'element-ui';
import headerNav from './components/HeaderNav';
import Login from "@/components/Login.vue"
export default {
  components: {
    headerNav,
    rLogin: Login
  },
  data() {
    return {
      showDialog: false,
      loadingCount: 0,
      loading: undefined
    }
  },
  created() {
    Vue.prototype.$showLoading = this.showLoading
    Vue.prototype.$hideLoading = this.hideLoading
    Vue.prototype.$showLogin = this.showLogin
    Vue.prototype.$hideLogin = this.hideLogin
    Vue.prototype.$switchNetwork = this.switchNetwork
    this.$message('message');
  },
  methods: {
    showLoading(msg) {
      if (this.loadingCount === 0) {
        this.loading = Loading.service({
          target: this.$refs.main,
          lock: true,
          text: msg || 'loading……',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      }
      this.loadingCount += 1;
    },
    hideLoading() {
      if (this.loadingCount <= 0) {
        return;
      }
      this.loadingCount -= 1;
      if (this.loadingCount === 0) {
        this.loading.close();
      }
    },
    showLogin() {
      this.showDialog = true
    },
    hideLogin() {
      this.showDialog = false
    },
    switchNetwork() {
      // Only BSC Testnet currently
    //   return window.ethereum.request({
    //   method: 'wallet_addEthereumChain',
    //   params: [{
    //     chainId: "0x61",
    //     chainName: "BNB Smart Chain Testnet",
    //     rpcUrls: [
    //       'https://data-seed-prebsc-1-s3.binance.org:8545/',
    //     ],
    //     blockExplorerUrls: [
    //       'https://testnet.bscscan.com/'
    //     ],
    //     nativeCurrency: {
    //       name: 'tBNB',
    //       symbol: 'tBNB',
    //       decimals: 18
    //     }
    //   }]
    // })
    return window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: "0x1a4",
        chainName: "Optimism Goerli",
        rpcUrls: [
          'https://goerli.optimism.io',
        ],
        blockExplorerUrls: [
          'https://goerli-optimism.etherscan.io'
        ],
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18
        }
      }]
    })
    }
  }
}
</script>

<style lang="less">
@font-face {
  font-family: "EXO";
  src: url('./assets/font/Exo-VariableFont_wght.ttf');
}
.el-message__content{
  font-family: EXO !important;
}
#app {
  font-family: EXO;
}
body,
html,
div,
ul,
ol,
li,
a {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
ul,
ol,
li {
  list-style: none;
}
.main {
  overflow-y: auto;
  background: linear-gradient(to top, #920011, #440008);
}
.card {
  position: relative;
  border-top: 1px solid #FF001D;
  background: linear-gradient(180deg, #800210 0%, #000000 30%);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}
.white-font {
  color: white;
}
.center-text {
  text-align: center;
}
.gray-font {
  color: #8A8A8A;
}
.red-font {
  color: #FF001D;
}
</style>
