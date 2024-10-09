<script setup>

import {onMounted, ref} from "vue";

// https://daisyui.com/docs/themes/ and don't forget to add the themes to tailwind.config.js
const lightTheme = "light";
const darkTheme = "dark";
const localStorageIsDarkKey = "__VUE_TEMPLATE__is_dark";
const isDark = ref(localStorage.getItem(localStorageIsDarkKey) === "true");

const applyTheme = () => {
  document.documentElement.setAttribute("data-theme", isDark.value ? darkTheme : lightTheme);
  localStorage.setItem(localStorageIsDarkKey, `${isDark.value}`);
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  applyTheme();
};

onMounted(() => {
  applyTheme()
});
</script>

<template>
  <label class="swap swap-rotate">
    <input :checked="isDark" @change="toggleTheme" type="checkbox" />
      <i class="px-3 swap-off bi bi-sun"></i>
      <i class="px-3 swap-on bi bi-moon"></i>
  </label>
</template>