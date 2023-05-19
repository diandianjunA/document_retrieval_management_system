<template>
  <div class="cover">
    <div class="material">
      <h2 style="position: absolute;top: 20px;bottom: 20px;left: 20px;right: 20px">{{ name }}</h2>
      <div :style="`position: absolute;top: 70px;margin-left: 25px;width: 12px;height: 12px;border-radius: 6px;background-color:`+color "></div>
      <span style="margin-left: 20px;position: absolute;top: 65px;left: 30px">{{item}}</span>
      <div style="position: absolute;top: 100px;left: 20px" v-html="resourceType"></div>
    </div>
  </div>
</template>

<script>

import {computed, toRefs} from "vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Material",
  props: ['name', 'content','category','categoryColor'],
  setup(props) {
    const { content,category,categoryColor } = toRefs(props)
    const resourceType = computed(() => content.value || '/')
    const item = computed(() => category.value || '/')
    const color = computed(() => categoryColor.value || '/')
    return {
      resourceType,
      item,
      color
    }
  }
}
</script>

<style scoped>
.material {
  position: relative;
  width: 900px;
  height: 170px;
  margin: 20px;
  background-color: #FFFFFF;
  border-radius: 25px;
  box-shadow: 0px 0px 20px -4px rgba(0, 0, 0, .1);
}

.cover {
  width: 900px;
  height: 170px;
  margin: 20px;
}

.material:hover {
  box-shadow: 0px 0px 20px -4px rgba(0, 0, 0, .2);
}
</style>
