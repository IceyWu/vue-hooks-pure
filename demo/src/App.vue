<script lang="ts" setup>
import { NButton, NFlex } from 'naive-ui'

import { usePopup, useRequest } from '../../src/index'
// import { usePopup, useRequest } from '../../dist/esm'
import TestCom from './compoenets/test.vue'

const { a } = useRequest()
console.log('🐠-----a-----', a)
async function testModel() {
  console.log('💗testModel---------->')
  // usePopup({}, TestCom)
  const tt = await usePopup(TestCom, {})
  console.log('🌳-----tt-----', tt)
}
</script>

<template>
  <NFlex align="center" justify="space-around">
    <NButton type="success" @click="testModel">
      Open Modal
    </NButton>
  </NFlex>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
