<script setup lang="ts">
// import Imgdeg from "@/assets/images/pop-up/deg.png";
import { onMounted } from 'vue'

interface Props {
  title?: string
  isCorrect?: boolean
}

defineProps<Props>()
const emits = defineEmits(['close', 'ok', 'cancel'])
function onClose() {
  emits('close', Date.now())
}
onMounted(() => {
//   setTimeout(() => {
//     onClose();
//   }, 1000);
})
</script>

<template>
  <div class="popup fcc flex-col">
    <!-- <h1 class="text-center text-3xl text-white">标题：{{ title }}</h1>
    <div v-motion-roll-bottom class="mt-10 flex flex-wrap space-x-2">
      <slot name="close">
        <button class="btn" @click="onClose">关闭</button>
      </slot>
      <button class="btn" @click="emits('ok')">ok</button>
      <button class="btn" @click="emits('cancel')">cancel</button>
    </div> -->
    <div class="parent">
      <div class="answer">
        <div class="img-an">
          as
        </div>
        <div class="item-an">
          <p v-if="isCorrect">
            答对了，太棒了！
          </p>
          <p v-else>
            答错了，请继续努力！
          </p>
        </div>
        <!-- <button></button> -->
        <button @click="onClose">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<style  scoped>
.popup {
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.8);
}

.parent {
  display: flex;
  justify-content: center;

  height: 100vh;

}

.answer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 516px;
  height: 442px;
  border-radius: 10px;
  background: #fff;
  margin-top: 500px;
}

.img-an {
  width: 300px;
  height: 250px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.item-an {
  display: flex;
  justify-content: center;
  margin-top: 30px;

  p {
    font-size: 26px;
    text-align: center;
  }
}
</style>
