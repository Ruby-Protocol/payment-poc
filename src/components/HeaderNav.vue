<template>
  <div
    :class="side?'header header-side':'header'"
    :style="{'background-color':bgColor,'padding-left':tab?'63px':'41px'}"
  >
    <img
      class="header-img"
      src="@/assets/icon/ruby.png"
      @click="gohome"
    >
    <ul
      class="header-nav-item"
      v-show="tab"
    >
      <li v-for="li in list" :key="li.label">
        <a class="label anchorotherweb" v-if="li.link != undefined" :href="li.link"
        :target="`${li.link == '#'?'':'_blank'}`">{{li.label}}</a>
        <span class="label" v-else :class="{'active': true}">{{li.label}}</span>
      </li>
    </ul>
    <el-dropdown class="header-info">
      <div>
        <img
          src="@/assets/images/user-icon.png"
          class="layer"
        >
        <span>
          {{user}}
        </span>
      </div>
      <el-dropdown-menu>
        <el-dropdown-item  @click.native="connect">
          Reconnect
        </el-dropdown-item>
        <el-dropdown-item v-if="user!='......'" @click.native="quit">
          Quit
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- <div class="header-language">
      En
    </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Dropdown, DropdownItem, DropdownMenu } from 'element-ui';
import { showLoading, hideLoading } from '../loading';

export default {
  data() {
    return {
      list: [
        {
          label: 'Swap'
        },
        // {
        //   label: 'Bridge',
        //   link: '#'
        //   // link: 'https://docs.ruby.network/tutorial/testnet-configuration'
        // },
        {
          label: 'Tutorial',
          link: 'https://ruby-docs.gitbook.io/ruby-protocol/tutorial/connect-your-wallet'
          // link: 'https://docs.ruby.network/tutorial/testnet-configuration'
        },
        {
          label: 'Q&A',
          link: 'https://ruby-docs.gitbook.io/ruby-protocol/faqs/faqs'
          // link: 'https://docs.ruby.network/mainnet-faqs/testnet-faq'
        },
        {
          label: 'Info',
          link: 'https://ruby-docs.gitbook.io/ruby-protocol'
          // link: 'https://docs.ruby.network/'
        }
      ]
    };
  },
  props: {
    side: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: String
    },
    tab: {
      type: Boolean,
      default: true
    }
  },
  components: {
      ElDropdown: Dropdown,
      ElDropdownItem: DropdownItem,
      ElDropdownMenu: DropdownMenu,
  },
  computed: mapState({
    // 箭头函数可使代码更简练
    user: state => {
        const userall = state.user
        const pre = userall.substring(0, 5)
        const behined = userall.substring(userall.length - 7)
        return `${pre}......${behined}`
    },
    type: state => {
        return state.type
    }
  }),
  methods:{
    quit() {
      this.$store.commit('setUser', '')
      console.log(this.$ruby)
      if(this.$ruby.rubyClient) {
        this.$ruby.rubyClient.account = undefined
        this.$ruby.rubyClient.home = undefined
      }
      this.$router.replace('/')
    },
    connect() {
      console.log('connect')
      this.initRubyClient()
    },
      gohome() {
          this.$router.push('/');
          this.$hideLoading();
      },
      async swap(command){
          if (!this.$ruby.rubyClient) {
           try {
               await this.initRubyClient();
           } catch (error) {
               this.$message('Connect wallet Error');
               console.error(error);
           }
        }
        if (this.$store.state.type === command) {
            this.$message('You Are Already Here');
            return;
        }
        this.$store.commit('setType', command);
        switch(command) {
            case 'BNB': {
                showLoading('init RubyBNBClient...')
                try {
                    await this.$ruby.initRubyEthClient();
                } catch (error) {
                    this.$message(error.message)
                    console.error(error)
                }
                hideLoading()
                this.$router.push('/login')
                break;
            }
            default: {
                this.$message('Coming Soon!')
            }
        }
      }
  }
};
</script>

<style lang="less" scoped>
* {
  font-family: EXO;
}
.header {
  height: 106px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 75px 10px 63px;
}
.active {
  position: relative;
  padding-bottom: 13px;
}
.active:after {
  text-align: center;
  position: absolute;
  bottom: 0px; left: 0;
  content: '';
  width: 100%;
  height: 3px;
  background: red;
  border-radius: 2px;
}
.label {
  position: relative;
  padding-bottom: 13px;
}
.label:hover:after {
  text-align: center;
  position: absolute;
  bottom: 0px; left: 0;
  content: '';
  width: 100%;
  height: 3px;
  background: red;
  border-radius: 2px;
}

.header-side::before {
  content: '';
  display: block;
  position: absolute;
  width: 320px;
  height: 100%;
  top: 0;
  left: 0;
  // background-image: linear-gradient(to right, #1c1243, #23095a);

}
.header-img {
  cursor: pointer;
  width: 134px;
  z-index: 2;
}

.header-nav-item {
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 125px;
  margin-top: -5px;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: justify;
  color: #ffffff;
  li {
    font-family: EXO;
    margin: 0 65px 0 0;
    cursor: pointer;
  }
  .el-dropdown-link {
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}

.header-info {
  cursor: pointer;
  position: absolute;
  right: 100px;
  width: 187px;
  height: 38px;
  padding: 1px;
  border-radius: 21px;
  border-style: solid;
  border-width: 1px;
  border-color: #FF001D;
  // border-image-source: linear-gradient(to right, #e388e8 16%, #590ab7 150%);
  // border-image-source: linear-gradient(to right, red 16%, red 150%);
  // border-image-slice: 1;
  // background-image: linear-gradient(to bottom, #1a1c29, #1a1c29),
  //   linear-gradient(to right, #e388e8 16%, #590ab7 150%);
  background: transparent;
  background-origin: border-box;
  background-clip: content-box, border-box;
  font-family: EXO;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  div {
    width: 100%; height: 100%;
    display: flex;
    align-items: center;
  }
  img {
    margin: 0 9px 0 14px;
    width: 18px;
  }
}
.header-language {
  position: absolute;
  right: 35px;
  width: 42px;
  height: 42px;
  margin: 5px 0 13px 0;
  line-height: 42px;
  text-align: center;
  color: #ffffff;
  border-radius: 21px;
  border-style: solid;
  border-width: 1px;
  border-image-source: linear-gradient(to right, #e388e8 16%, #590ab7 150%);
  border-image-slice: 1;
  background-image: linear-gradient(to bottom, #1a1c29, #1a1c29),
    linear-gradient(to right, #e388e8 16%, #590ab7 150%);
  background-origin: border-box;
  background-clip: content-box, border-box;
}
.anchorotherweb {
    text-decoration: none;
    color: #fff;
}
</style>
