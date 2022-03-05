<template>
  <addVideo :video="selectedVideo" @close="openAdd = false" v-if="openAdd" />
  <main>
    <header>
      <h1>Playlister</h1>
      <span @click="openAdd = true" class="material-icons">add</span>
    </header>
    <article class="cards-container">
      <div class="empty" v-if="videos.length === 0">
        <h1>The list is empty</h1>
      </div>
      <template v-else v-for="(video, index) in videos" :key="index">
        <videoCard :video="video" />
      </template>
    </article>
  </main>
</template>

<script>
import "material-icons/iconfont/material-icons.css";
import videoCard from "./components/card.vue";
import addVideo from "./components/add-video.vue";
import { useStore } from "vuex";
import { computed, ref, watch } from "vue";
export default {
  name: "App",
  components: {
    videoCard,
    addVideo,
  },
  setup() {
    const store = useStore();

    store.dispatch("getVideos");
    store.dispatch("getPlaylists");

    const videos = computed(() => {
      return store.getters.videos;
    });

    const openAdd = ref(false);

    const selectedVideo = computed(() => {
      return store.state.toEditVideo;
    });

    watch(selectedVideo, () => {
      if (selectedVideo.value !== null) {
        openAdd.value = true;
      }
    });

    return {
      videos,
      openAdd,
      selectedVideo,
    };
  },
};
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap')
@import "./sass/colors.scss"
@import "./sass/components.scss"

*
  box-sizing: border-box
  margin: 0
  padding: 0
  outline: none
  font-size: 14px
  font-family: "Roboto", sans-serif

#app
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: $black

.app
  background: $lighter-gray

a
  text-decoration: none
  color: $black

main
  max-width: 950px
  margin: 0 auto
  padding: 50px 0
  header
    margin: 50px 0
    display: flex
    align-items: center
    justify-content: center
    h1
      font-size: 2rem
      font-weight: 900
      text-align: center
    span
      margin-left: 20px
      padding: 5px
      background: $primary
      color: #fff
      display: flex
      justify-content: center
      align-items: center
      cursor: pointer
  .cards-container
    display: grid
    grid-template-columns: repeat(4, minmax(0, 1fr))
    column-gap: 10px
    row-gap: 20px
  .empty
    background: #fdd0d0
    grid-column: 1 / -1
    h1
      color: #A04545
</style>
