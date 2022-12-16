<template>
  <div class="tx-input">
    <input cal type="text" :value="value" @input="handleInput" :placeholder="placeholder"
    :style="`${noIcons?'width: 100%;':''} ${!noIcons&&noMax?'width: 208.59px;':''}`">
    <span v-if="!noIcons && !noMax" class="white-font max" @click="$emit('max')">MAX</span>
    <img v-if="!noIcons" src="../assets/icon/ruby-icon.png" alt="" srcset="">
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number]
    },
    placeholder: String,
    noIcons: Boolean,
    noMax: Boolean
  },
  methods: {
    handleInput ($event) {
      // 通过input标签的原生事件input将值emit出去，以达到值得改变实现双向绑定
      this.$emit('input', $event.target.value)
    }
  }
}
</script>

<style lang="less" scoped>
.tx-input {
  position: relative;
  width: 260px; height: 35px;
  border-bottom: 1px solid #FF001D;
  img {
    margin-left: 10px;
  }
  span {
    position: relative;
    bottom: 8px;
  }
  input {
    padding: 0;
    width: 160px; height: 35px;
    text-decoration: none;
    border: 0px;
    outline: none;
    background: transparent;
    color: white;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.5em;
  }
}
.max {
  border-radius: 15px;
  padding: 5px 10px;
  border: 1.5px solid white;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
}
</style>