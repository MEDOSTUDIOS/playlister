<template>
  <div class="card">
    <div class="card-content">
      <div class="image">
        <img :src="video.thumbnail" />
      </div>
      <label class="title">{{ video.title }}</label>
      <span class="author">{{ video.author }}</span>
      <div class="playlists">
        <template v-for="(playlist, index) in video.Playlists" :key="index">
          <a href="/#" class="playlist">{{ playlist.name }},</a>
        </template>
      </div>
      <div class="controllers">
        <button class="button icon secondary">
          <span
            class="material-icons"
            @click="$store.dispatch('deleteVideo', video.id)"
          >
            delete
          </span>
        </button>
        <button class="button icon primary">
          <span
            class="material-icons"
            @click="$store.commit('selectToEditVideo', video)"
          >
            edit
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "videoCard",
  props: {
    video: Object,
  },
};
</script>

<style lang="sass" scoped>
@import "../sass/colors.scss"
.card
  max-width: 220px
  min-width: 220px
  height: 100%
  text-align: left
.card-content
    height: 100%
    background: #fff
    border-radius: 5px
    box-shadow: 0 10px 20px rgba($black, 0.2)
    padding: 10px
    display: flex
    flex-direction: column
    .image
        border-radius: 3px
        width: 100%
        height: 196px
        img
          width: 100%
          height: 100%
          object-fit: cover
    .title
        display: block
        margin-top: 10px
        margin-bottom: 5px
        font-weight: 600
        color: darken($dark-gray, 10)
        overflow-wrap: break-word
    .author
        display: block
        font-weight: 500
        color: $dark-gray
    .playlists
        display: flex
        flex-wrap: wrap
        align-items: center
        row-gap: 5px
        margin: 10px 0
        .playlist
            color: $primary
            font-weight: 600
            margin: 0 5px
            transition:  0.3s ease-in-out
            &:nth-of-type(1)
                margin: 0
            &:hover
                color: $primary-dark
        button
            margin-left: 5px
    .controllers
        margin-top: auto
        display: flex
        column-gap: 10px
</style>
