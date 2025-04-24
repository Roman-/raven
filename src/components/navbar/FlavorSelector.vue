<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { allFlavors } from "@/js/FlavorFactory";

const store = useStore();
const flavorDialog = ref(null);

function openDialog() {
  flavorDialog.value?.showModal();
}

function closeDialog() {
  flavorDialog.value?.close();
  store.commit('generate');
}

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

function selectOnly(flavor) {
  store.commit('selectNoFlavors');
  store.commit('toggleFlavor', flavor);
  closeDialog();
}

const allFlavorsList = computed(() => allFlavors);

// Return number of features for a given flavor
function featureCount(flavor) {
  return Object.keys(flavor.getFeaturesVariations()).length;
}
// Determine badge color class based on feature count
function badgeClass(flavor) {
  const count = featureCount(flavor);
  if (count === 1) return 'badge badge-success';
  if (count === 2) return 'badge badge-warning';
  if (count === 3) return 'badge bg-orange-500 text-white';
  return 'badge badge-error';
}
</script>

<template>
  <button
      class="btn btn-sm mx-2"
      @click="openDialog"
      title="Select Flavors">
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
          <span :class="badgeClass(flavor)">{{ featureCount(flavor) }}</span>
        </label>
        <button
            class="btn btn-xs btn-link"
            type="button"
            @click.stop.prevent="selectOnly(flavor)">
          only
        </button>
      </div>

      <div class="modal-action">
        <button class="btn" type="submit" @click="closeDialog">Close</button>
      </div>
    </form>
  </dialog>
</template>
