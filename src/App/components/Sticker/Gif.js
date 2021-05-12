import { IconButton } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import axios from "axios";
import { debounce } from "lodash";
import React, { useRef, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
const apiKey = "7oleYFqKiRberKvCCXQQDw0ki0IcmQfu";
const ENDPOINT = "https://api.giphy.com/v1/gifs";
const getTrendingGif = (callback) => {
  axios
    .get(`${ENDPOINT}/trending?api_key=${apiKey}&limit=30&rating=pg-13`)
    .then((res) => {
      const { data } = res;
      callback([
        ...data.data,
        {
          images: {
            original: {
              url:
                "https://res.cloudinary.com/hoanghai/image/upload/v1618849214/Radius-E/product/jvh0jq3o1ak7k01c3sro.gif",
            },
          },
        },
      ]);
    });
};
const getSearchGif = (q, callback) => {
  axios
    .get(`${ENDPOINT}/search?api_key=${apiKey}&limit=30&rating=pg-13&q=${q}`)
    .then((res) => {
      const { data } = res;
      callback(data.data);
    });
};
function Gif({ sendAMessage }) {
  const [gifs, setGifs] = useState(undefined);
  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    getTrendingGif(setGifs);
  }, []);
  const fetchGifSearch = (q) => {
    getSearchGif(q, setGifs);
  };
  const debounceFetchGif = useRef(debounce((q) => fetchGifSearch(q), 1000))
    .current;
  const sendAGif = (gif) => {
    sendAMessage(2, gif);
  };
  const onSearchGif = (e) => {
    const q = e.target.value;
    setKeyword(q);
    if (e.target.value.length === 0) {
      setGifs(undefined);
      getTrendingGif(setGifs);
    } else {
      setKeyword(q);
      setGifs(undefined);
      debounceFetchGif(q);
    }
  };
  return (
    <div className="gif">
      <div className="gif-search">
        <IconButton className="btn-search">
          <SearchOutlined />
        </IconButton>
        <input
          value={keyword}
          onChange={onSearchGif}
          placeholder="Search gifs"
        />
      </div>
      <div className="gif-display">
        {gifs ? (
          <div className="gif-display-grid">
            <div className="column">
              {gifs.slice(0, Math.floor(gifs.length / 2)).map((gif) => {
                return (
                  <img
                    onClick={() => sendAGif(gif.images.original.url)}
                    src={gif.images.original.url}
                    alt="gif"
                  />
                );
              })}
            </div>
            <div className="column">
              {gifs.slice(Math.floor(gifs.length / 2)).map((gif) => {
                return (
                  <img
                    onClick={() => sendAGif(gif.images.original.url)}
                    src={gif.images.original.url}
                    alt="gif"
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <Skeleton width={200} height={100} count={25} />
        )}
      </div>
    </div>
  );
}

export default Gif;
