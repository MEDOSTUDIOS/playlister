const {
  VideoExists,
  CreatePlaylist,
  CreateVideo,
} = require("../../src/main/database/api");

/**
 * @jest-environment node
 */
jest.setTimeout(50000);

test("CRUD APIs", async () => {
  try {
    let link =
      "https://www.youtube.com/watch?v=94OeIZhQCOo&ab_channel=MidnightWhiskey";

    const ytdl = require("ytdl-core");

    let info = await ytdl.getInfo(link);

    if (await VideoExists(info.videoDetails.videoId)) {
      throw new Error("Video already exists in Database");
    }

    expect(info).toEqual(expect.objectContaining({}));

    let videoInfo = {
      video_id: info.videoDetails.videoId,
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      thumbnail:
        info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]
          .url,
      url: info.videoDetails.video_url,
      length: info.videoDetails.lengthSeconds,
      duration: new Date(info.videoDetails.lengthSeconds * 1000)
        .toISOString()
        .substring(11, 19),
    };

    let playlist = await CreatePlaylist("Favorites");

    expect(playlist).toEqual(expect.objectContaining({}));

    expect(await CreateVideo(videoInfo, playlist.id)).toBeDefined();
  } catch (err) {
    throw new Error(err);
  }
});
