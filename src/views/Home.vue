<script setup>

import {store} from "@/store/store";

</script>

<template>
  <h1 class="text-3xl font-bold p-2">
    Template
  </h1>
<div class="flex justify-around">
  <div>with tailwind</div>
  <div>with daisyUI</div>
  <div>with i18n?</div>
</div>
  <div class="p-3">
    <h1 class="text-2xl font-semibold">
      Lorem ipsum.
    </h1>
    <div>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquid aspernatur atque aut autem beatae corporis culpa dolor dolore dolorum earum eius illum inventore ipsa iure laboriosam magnam magni minus nisi numquam optio, pariatur possimus quasi quisquam quos rem repellat saepe, sapiente sed soluta tempora tempore tenetur voluptate voluptatibus, voluptatum!
      Coins = {{store.state.coins}}
    </div>
  </div>
</template>