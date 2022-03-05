import { createStore } from "vuex";

export default createStore({
  state: {
    videos: [],
    toEditVideo: null,
    playlists: [],
  },
  getters: {
    videos: (state) => {
      return state.videos;
    },
    playlists: (state) => {
      return state.playlists;
    },
  },
  mutations: {
    selectToEditVideo(state, value) {
      state.toEditVideo = value;
    },
  },
  actions: {
    getVideos: async (ctx) => {
      let response = await window.ipc.invoke("get-videos");
      if (response.status === true) {
        ctx.state.videos = response.data;
      }
    },
    getPlaylists: async (ctx) => {
      let response = await window.ipc.invoke("get-playlists");
      if (response.status === true) {
        ctx.state.playlists = response.data;
      }
    },
    deleteVideo: async (ctx, id) => {
      let response = await window.ipc.invoke("delete-video", id);

      if (response.status === true) {
        ctx.dispatch("getVideos");
      }
    },
    updateVideo: async (ctx, data) => {
      if (data.playlists.existingPlaylists !== null) {
        data.playlists.existingPlaylists = data.playlists.existingPlaylists.map(
          (pl) => {
            let plObj = ctx.state.playlists.filter((playlist) => {
              return playlist.name === pl;
            })[0];

            return plObj.id;
          }
        );
      }

      let response = await window.ipc.invoke("update-video", data);

      if (response.status === true) {
        ctx.dispatch("getVideos");
        ctx.dispatch("getPlaylists");
      }
    },
    createVideo: async (ctx, data) => {
      if (data.playlists.existingPlaylists !== null) {
        data.playlists.existingPlaylists = data.playlists.existingPlaylists.map(
          (pl) => {
            let plObj = ctx.state.playlists.filter((playlist) => {
              return playlist.name === pl;
            })[0];

            return plObj.id;
          }
        );
      }

      let response = await window.ipc.invoke("create-video", data);

      if (response.status === true) {
        ctx.dispatch("getVideos");
        ctx.dispatch("getPlaylists");
      }
    },
  },
});
