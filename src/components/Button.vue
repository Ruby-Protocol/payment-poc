<template>
  <button>
    <slot>button</slot>
  </button>
</template>

<script>
export default {

}
</script>

<style scoped>
button {
  font-family: EXO;
  cursor: pointer;
  padding: 8px;
  background: linear-gradient(to bottom, #530009, #230004);
  color: white;
  border: 0;
  border-radius: 0;
}
button:hover {
  background: linear-gradient(to bottom, #FF001D, #550009);
}
</style>