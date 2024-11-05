<script lang="ts" setup>
import axios from 'axios'

import { NButton, NFlex } from 'naive-ui'
import { computed, onMounted } from 'vue'
import { useRequest } from '../../src/index'
// import { usePopup, useRequest } from '../../dist/esm'

async function getData(params) {
  console.log('🎉-----params-----', params)
  return axios.get('https://api.github.com/users')
  // return axios
}

const { onRefresh, onLoad, result, loading } = useRequest(getData, {
  target: 'list',
  getVal: res => res.data,
  listOptions: {

    // defaultPageKey: 'page_a',
    // defaultSizeKey: 'size_a',
    // defaultDataKey: 'data_a',
    // defaultTotalKey: 'total_a',
    // defaultFinishedKey: 'finished_a',
    // defaultLoadingKey: 'loading_a',
    // defaultRefreshKey: 'refresh_a',

  },

})
async function testModel() {
  await onLoad()
  console.log('🌳-----data-----', result.value)
}
onMounted(async () => {
  await onRefresh()
  console.log('🌳-----data-----', result.value)
})
const showVl = computed(() => {
  const { data, ...tt } = result.value
  return tt
})
</script>

<template>
  <NFlex align="center" justify="space-around">
    <NButton type="success" @click="testModel">
      Open Modal
    </NButton>
    <div v-if="loading">
      <h1>loading.........</h1>
    </div>
    <div v-else>
      {{ showVl }}
    </div>
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
