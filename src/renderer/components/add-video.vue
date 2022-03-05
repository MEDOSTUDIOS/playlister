<template>
  <div class="form-wrapper">
    <div class="form-modal">
      <h2>{{ isEdit ? "Update" : "Create" }}</h2>
      <form @submit.prevent="addVideo">
        <label for="url">URL</label>
        <input
          v-model="url"
          type="url"
          name="url"
          placeholder="Enter the video URL"
          required
        />
        <label for="playlists">Playlists</label>
        <div class="pls">
          <input
            placeholder="Separate playlists with comma ','"
            type="text"
            list="playlists-available"
            multiple="multiple"
            id="multi-select"
            v-model="selectedPlaylists"
          />
          <datalist id="playlists-available">
            <template v-for="(playlist, index) in playlists.value" :key="index">
              <option :value="playlist"></option
            ></template>
          </datalist>

          <span
            v-if="!openNewPL"
            class="material-icons add"
            @click="openNewPL = true"
            >add</span
          >
          <span v-else class="material-icons add" @click="openNewPL = false"
            >close</span
          >
        </div>
        <label v-if="openNewPL" for="new-playlists">New playlists</label>
        <input
          v-if="openNewPL"
          v-model="newPlaylists"
          type="text"
          name="new-playlists"
          placeholder="Separate playlists with comma ','"
        />

        <footer>
          <button type="submit" class="button primary">
            {{ isEdit ? "Update" : "Add" }}
          </button>
          <button @click="cancel" type="button" class="button white-s">
            Cancel
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
export default {
  name: "addVideo",
  props: {
    video: Object,
  },
  emits: ["close"],
  setup(props, ctx) {
    const store = useStore();

    const isEdit = props.video !== null;

    const playlists = reactive({
      value: store.getters.playlists.map((pl) => {
        return pl.name;
      }),
    });

    const url = ref(isEdit ? props.video.url : "");

    const newPlaylists = ref("");
    const openNewPL = ref(false);
    const selectedPlaylists = ref(
      isEdit
        ? props.video.Playlists.map((pl) => {
            return pl.name;
          }).join(",")
        : ""
    );

    const separator = ",";

    function filldatalist(input, optionValues, optionPrefix) {
      const list = input.list;
      if (list && optionValues.length > 0) {
        list.innerHTML = "";

        const usedOptions = optionPrefix
          .split(separator)
          .map((value) => value.trim());

        for (const optionsValue of optionValues) {
          if (usedOptions.indexOf(optionsValue) < 0) {
            const option = document.createElement("option");
            option.value = optionPrefix + optionsValue;
            list.append(option);
          }
        }
      }
    }

    onMounted(() => {
      const input = document.querySelector("#multi-select");
      const optionsValues = Array.from(input.list.options).map(
        (opt) => opt.value
      );
      let valueCount = input.value.split(separator).length;

      input.addEventListener("input", () => {
        const currentValueCount = input.value.split(separator).length;

        if (valueCount !== currentValueCount) {
          const lsIndex = input.value.lastIndexOf(separator);
          const str =
            lsIndex !== -1 ? input.value.substr(0, lsIndex) + separator : "";
          filldatalist(input, optionsValues, str);
          valueCount = currentValueCount;
        }
      });
    });

    function cancel() {
      store.commit("selectToEditVideo", null);
      ctx.emit("close");
    }

    function addVideo() {
      let data = {
        playlists: {
          existingPlaylists:
            selectedPlaylists.value === ""
              ? null
              : selectedPlaylists.value.split(",").filter((pl) => pl !== ""),
          newPlaylists:
            openNewPL.value === false
              ? null
              : newPlaylists.value.split(",").filter((pl) => pl !== ""),
        },
      };

      if (isEdit) {
        data.id = props.video.id;
        store.dispatch("updateVideo", data);
      } else {
        data.url = url.value;
        store.dispatch("createVideo", data);
      }

      store.commit("selectToEditVideo", null);
      ctx.emit("close");
    }

    return {
      isEdit,
      playlists,
      url,
      newPlaylists,
      openNewPL,
      selectedPlaylists,
      addVideo,
      cancel,
    };
  },
};
</script>

<style lang="sass" scoped>
@import "../sass/colors.scss"

.form-wrapper
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 900
  background: rgba($primary-dark, 0.7)
  backdrop-filter: blur(5px)
  display: flex
  align-items: center
  justify-content: center

.form-modal
  background: #fff
  padding: 25px
  border-radius: 5px
  box-shadow: 20px 0 40px rgba($black, 0.1)
  width: 480px
  h2
    font-size: 1.8rem
    text-align: center
    margin-bottom: 20px
form
    display: grid
    grid-template-columns: 15% 85%
    column-gap: 10px
    row-gap: 20px
    align-items: center
    label
        font-weight: 600
    .pls
        display: flex
        width: 100%
        column-gap: 10px
        align-items: center
        input
          width: 100%
        .add
            background: $primary
            color: #fff
            display: flex
            align-items: center
            justify-content: center
            padding: 6px
            border-radius: 5px
            cursor: pointer
            transition: background 0.3s ease-in-out

            &:hover
                background: $primary-dark
    footer
        margin-top: 20px
        grid-column: 1/-1
        display: flex
        align-items: center
        justify-content: center
        column-gap: 20px
        button
            min-width: 80px
</style>
