<script setup>

import PreUploadedPic from "@/components/upload_or_choose/PreUploadedPic.vue";
import {store} from "@/store/store";

</script>

<template>
  <h1 class="text-3xl font-bold p-2">
    Select an image:
  </h1>
<div class="flex justify-around">
  <PreUploadedPic pic=""/>
  <PreUploadedPic pic="img/pre_uploaded_src/Mona%20Lisa.jpg"/>
  <PreUploadedPic pic="img/pre_uploaded_src/Marilyn%20Monroe.jpg"/>
  <PreUploadedPic pic="img/pre_uploaded_src/Van%20Gogh.jpg"/>
</div>
  <div class="p-3">
    <h1 class="text-2xl font-semibold">
      Create mosaic! {{store.state.count}}
    </h1>
    <div>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquid aspernatur atque aut autem beatae corporis culpa dolor dolore dolorum earum eius illum inventore ipsa iure laboriosam magnam magni minus nisi numquam optio, pariatur possimus quasi quisquam quos rem repellat saepe, sapiente sed soluta tempora tempore tenetur voluptate voluptatibus, voluptatum!
    </div>
  </div>
</template>