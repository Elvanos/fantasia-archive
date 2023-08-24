<template>
  <div>
    <p>{{ title }}</p>
    <q-list>
      <q-item
        v-for="todo in todos"
        :key="todo.id"
        clickable
        @click="increment"
      >
        {{ todo.id }} - {{ todo.content }}
      </q-item>
    </q-list>

    <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: {{ clickCount }}</p>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

interface Todo {
  id: number;
  content: string;
}

interface Meta {
  totalCount: number;
}

const props = withDefaults(
  defineProps<{
    title: string;
    todos?: Todo[];
    meta: Meta;
    active?: boolean;
  }>(),
  {
    todos: () => []
  }
)

const clickCount = ref(0)
function increment () {
  clickCount.value += 1
  return clickCount.value
}

const todoCount = computed(() => props.todos.length)
</script>
