import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import router from './router'
// import { Message, Dialog, Loading, Dropdown, DropdownItem, DropdownMenu } from 'element-ui';
import { Message, Dialog, Loading} from 'element-ui';
import rubyApp from './rubyClient'
// import { showLoading, hideLoading} from './loading'

// import 'element-ui/lib/theme-chalk/index.css';
import "./assets/theme/ruby/index.css"

Vue.use(Vuex)
Vue.use(Dialog);
Vue.use(Loading);
// Vue.use(Dropdown);
// Vue.use(DropdownItem);
// Vue.use(DropdownMenu);
// Vue.use(MessageBox);

// Vue.use(ElementUI)
const store =  new Vuex.Store({
    state: {
      user: '',
      type: '',
      rubyBalance: 0,
      mateMaskBalance: 0,
      rubyAddress: '',
    },
    mutations: {
      setUser(state, user) {
        state.user = user
      },
      setType(state, type) {
        state.type = type
      },
      setRubyAddress(state, rubyAddress) {
        state.rubyAddress = rubyAddress
      },
      setRubyBalance(state, rubyBalance) {
          state.rubyBalance = rubyBalance
      },
      setMateMaskBalance(state, mateMaskBalance) {
        state.mateMaskBalance = mateMaskBalance
      },
    },
    actions: {
        async getRubyBalance({ commit }) {
            const rubyBalance = await rubyApp.rubyEthBalance()
            commit('setRubyBalance', rubyBalance)
        },
        async getMateMaskBalance({ commit, state }) {
            const mateMaskBalance = await rubyApp.web3.eth.getBalance(state.user)
            commit('setMateMaskBalance', (mateMaskBalance / 1000000000000000000).toFixed(4))
        },
        async getBalance({ dispatch }) {
            // showLoading('Get account information...')
            try {
                await dispatch('getRubyBalance')
                await dispatch('getMateMaskBalance')
            } catch (error) {
                Message('Something Went Wrong.')
                console.error(error)
            }
            // hideLoading()
        }
    }
})


const initRubyClient = (net) => {
    return rubyApp.init(net).then( async function() {
        // showLoading('connect service...')
        try {
            let accounts = await rubyApp.web3.eth.getAccounts();
            console.log(accounts)
            const balance = await rubyApp.web3.eth.getBalance(accounts[0])
            // console.log('stop3')
            console.log('banlance', balance) 
            // console.log('stop4')
            store.commit('setUser', accounts[0])
            // console.log('stop5')
        } catch (error) {
          console.log(error)
            Message('Click The Account Button to Reconnect Your Wallet or Refresh This Page.')
        }
        // hideLoading()
    })
}
initRubyClient('ETH');

Vue.prototype.$ruby = rubyApp;
Vue.prototype.initRubyClient = initRubyClient;

// bnjs wendang；随机生成字符串
// login yonghu xinxi 
// Vue.component(Message.name, Message);
Vue.prototype.$message = Message;

Vue.config.productionTip = false

new Vue({
store,
router,
render: h => h(App)
}).$mount('#app')