import { ipcMain } from "electron";
import {
  ReadPlaylist,
  ReadVideo,
  CreatePlaylist,
  CreateVideo,
  DeleteVideo,
  UpdateVideo,
} from "./database/api";
const ytdl = require("ytdl-core");

async function server() {
  try {
    /**
     * we return an object in every IPC with a status value,
     * to check it on the front-end before getting the data.
     * It's error handling procedure.
     */
    ipcMain.handle("get-videos", async (e, videoIds) => {
      try {
        return {
          status: true,
          data: await ReadVideo(videoIds, true),
        };
      } catch (err) {
        return { status: false, data: err.message };
      }
    });

    ipcMain.handle("get-playlists", async () => {
      try {
        return { status: true, data: await ReadPlaylist() };
      } catch (err) {
        return { status: false, data: err.message };
      }
    });

    ipcMain.handle(
      "create-video",
      async (e, { url, playlists: { existingPlaylists, newPlaylists } }) => {
        try {
          /**
           * Creating a video is a bit tricky, we have many conditions
           * we should handle.
           *    If the user provide us with an already existing playlist,
           *    If the used added a new playlist
           *    If the user has selected both previous conditions
           *    If the use has not added any playlist
           */
          let playlistIDs = [];

          if (existingPlaylists !== null) {
            playlistIDs = playlistIDs.concat(existingPlaylists);
          }

          if (newPlaylists !== null) {
            let playlists = await CreatePlaylist(newPlaylists);
            playlistIDs = playlistIDs.concat(
              playlists.map((pl) => {
                return pl.id;
              })
            );
          }

          /**
           * The playlistIDs array will collect the IDs of the playlist added or existing
           * and pass them to CreateVideo, which will handle the association.
           */

          let videoData = await getVideoData(url);

          await CreateVideo(videoData, playlistIDs);

          return {
            status: true,
          };
        } catch (err) {
          return { status: false, data: err };
        }
      }
    );

    ipcMain.handle(
      "update-video",
      async (e, { id, playlists: { existingPlaylists, newPlaylists } }) => {
        try {
          /**
           * Update function is the same as Create, the difference
           * is only we update them instead of adding them.
           * The update function updates only the playlists association,
           * and not the video data!
           */
          let playlistIDs = [];
          if (existingPlaylists !== null) {
            playlistIDs = playlistIDs.concat(existingPlaylists);
          }
          if (newPlaylists !== null) {
            let playlists = await CreatePlaylist(newPlaylists);
            playlistIDs = playlistIDs.concat(
              playlists.map((pl) => {
                return pl.id;
              })
            );
          }

          await UpdateVideo(id, null, playlistIDs);

          return {
            status: true,
          };
        } catch (err) {
          return { status: false, data: err };
        }
      }
    );

    ipcMain.handle("delete-video", async (e, id) => {
      try {
        /**
         * When we delete a video, the relationship is deleted too.
         */
        await DeleteVideo(id);
        return { status: true };
      } catch (err) {
        return { status: false, data: err.message };
      }
    });
  } catch (err) {
    throw new Error(err);
  }
}

async function getVideoData(url) {
  let info = await ytdl.getInfo(url);

  let videoInfo = {
    video_id: info.videoDetails.videoId,
    title: info.videoDetails.title,
    author: info.videoDetails.author.name,
    thumbnail:
      info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
    url: info.videoDetails.video_url,
    length: info.videoDetails.lengthSeconds,
    duration: new Date(info.videoDetails.lengthSeconds * 1000)
      .toISOString()
      .substring(11, 19),
  };

  return videoInfo;
}

export { server };
