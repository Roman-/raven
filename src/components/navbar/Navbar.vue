<script setup>

import { store } from "@/store/store";
import {useRouter} from "vue-router";

const router = useRouter();

</script>

<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl" @click="router.push('/')">__VUE_TEMPLATE__</a>
    </div>
    <div class="flex-none">
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-amber-400"></div>
            <span class="px-1">
              {{store.state.coins}}
            </span>
          </div>
        </div>
        <div
            tabindex="0"
            class="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
          <div class="card-body">
            <div>
              <span class="text-md inline">Balance:</span>
              <span class="text-md inline font-bold mx-2">{{store.state.coins}} coin(s)</span>
            </div>
            <div class="card-actions">
              <button class="btn btn-primary btn-block">Top up</button>
              <button class="btn btn-primary btn-block" @click="store.dispatch('updateFromDb')">Update from db</button>
            </div>
          </div>
        </div>
      </div>
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img
                alt="Avatar"
                src="https://avatar.iran.liara.run/public/boy?username=Ash" />
          </div>
        </div>
        <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <li>
            <a class="justify-between">
              Profile
              <span class="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
