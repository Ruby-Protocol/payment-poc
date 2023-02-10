<template>
  <div @mouseover="active=true" @mouseleave="active=false" class="card card-size"
  style="cursor: pointer">
    <el-row style="height: 100%" type="flex" justify="space-between" align="center">
      <el-col :span="16">
        <div :class="`text ${active?'active':''}`">
          {{text}}
        </div>
        <div :class="`gray ${active?'active':''}`">-</div>
        <div :class="`gray content ${active?'active':''}`">
          {{content}}
        </div>
      </el-col>
      <el-col :span="8">
        <div style="margin-top: 15px;">
          <BNB :active="active" :width="iconWidth" :fill="defaultColor" v-if="text == 'BNB'"/>
          <DAI :active="active" :width="iconWidth" :fill="defaultColor" v-else-if="text == 'DAI'"/>
          <USDT :active="active" :width="iconWidth" :fill="defaultColor" v-else-if="text == 'USDT'"/>
          <RUBY :active="active" :width="iconWidth" :fill="defaultColor" v-else-if="text == 'RUBY'"/>
          <ETH :active="active" :width="iconWidth" :fill="defaultColor" v-else/>
        </div>
      </el-col>
    </el-row>
    <!-- <div class="l-bottom">
    </div>
    <div class="r-top"></div> -->
  </div>
</template>

<script>
import {Col, Row} from "element-ui"
import {ETH, BNB, DAI, USDT, RUBY} from "@/components/svg/index.js"

export default {
  data() {
    return {
      active: false,
      defaultColor: '#440008',
      iconWidth: 75
    };
  },
  props: {
    logo: String,
    text: String,
    content: String
  },
  components: {
    ElCol: Col,
    ElRow: Row,
    ETH,
    BNB,
    DAI,
    USDT,
    RUBY,
  },
};
</script>

<style lang="less" scoped>
.card-size {
  width: 269px;
  height: 108px;
}
.active {
  color: white !important;
}
.text {
  margin: 15px;
  margin-bottom: 0px;
  font-family: 'Exo';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 27px;
  color: #FF001D;
}
.gray {
  color: #8A8A8A;
  margin-left: 15px;
}
.content {
  margin: 15px;
  margin-top: 0px;
  font-family: 'Exo';
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
}
</style>
