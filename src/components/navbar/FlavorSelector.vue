<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import {allFlavors} from "@/js/FlavorFactory";

const store = useStore();
const flavorDialog = ref(null);
function openDialog() {
  flavorDialog.value?.showModal();
}
function closeDialog() {
  flavorDialog.value?.close();
  store.commit('generate');
}

// For each flavor, we want to see if it is in "availableFlavors".
function isSelected(flavor) {
  return store.state.selectedFlavors.includes(flavor);
}

function toggleFlavor(flavor) {
  store.commit('toggleFlavor', flavor);
}

function selectAll() {
  store.commit('selectAllFlavors');
}

function selectNone() {
  store.commit('selectNoFlavors');
}

const allFlavorsList = computed(() => allFlavors);
</script>

<template>
  <button class="btn btn-sm mx-2" @click="openDialog" title="Select Flavors">
    <i class="bi bi-card-checklist"></i>
  </button>

  <!-- The dialog itself -->
  <dialog ref="flavorDialog" class="modal">
    <form method="dialog" class="modal-box">
      <h3 class="text-lg font-bold mb-4">Select Flavors</h3>

      <!-- Two utility buttons at the top: select all / select none -->
      <div class="flex gap-2 mb-4">
        <button class="btn btn-sm" type="button" @click.stop.prevent="selectAll">All</button>
        <button class="btn btn-sm" type="button" @click.stop.prevent="selectNone">None</button>
      </div>

      <!-- Show each flavor -->
      <div
          v-for="flavor in allFlavorsList"
          :key="flavor.name"
          class="flex items-center gap-2 mb-2"
      >
        <label class="flex items-center gap-2 cursor-pointer">
          <input
              type="checkbox"
              class="checkbox"
              :checked="isSelected(flavor)"
              @change="toggleFlavor(flavor)"
          />
          <span>
            {{ flavor.name }}
          </span>
        </label>
      </div>

      <div class="modal-action">
        <button class="btn" type="submit" @click="closeDialog">Close</button>
      </div>
    </form>
  </dialog>
</template>
