<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const flavorDialog = ref(null);
function openDialog() {
  flavorDialog.value?.showModal();
}
function closeDialog() {
  flavorDialog.value?.close();
}

// For each flavor, we want to see if it is in "availableFlavors".
function isSelected(flavor) {
  return store.state.availableFlavors.includes(flavor);
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

const allFlavorsList = computed(() => store.state.allFlavors);

</script>

<template>
  <button class="btn btn-sm mx-2" @click="openDialog">
    Flavors
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
        <!-- use a checkbox to toggle the flavor -->
        <input
            type="checkbox"
            class="checkbox"
            :checked="isSelected(flavor)"
            @change="toggleFlavor(flavor)"
        />
        <span>
          {{ flavor.name }}
        </span>
      </div>

      <div class="modal-action">
        <button class="btn" type="submit">Close</button>
      </div>
    </form>
  </dialog>
</template>
