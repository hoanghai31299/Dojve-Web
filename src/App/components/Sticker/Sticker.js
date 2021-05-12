import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import Skeleton from "react-loading-skeleton";
import { Fab, IconButton, Tooltip } from "@material-ui/core";
import { Add, SearchOutlined } from "@material-ui/icons";
import axios from "../../utils/axios";
import { message } from "antd";
function Sticker({ sendAMessage }) {
  const user = useSelector((state) => state.user.current);
  const [packages, setPackages] = useState(undefined);
  const [selectPack, setSelectPack] = useState(undefined);
  const [stickers, setStickers] = useState(undefined);
  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    axios.get("/sticker/getTrendingPack").then((res) => {
      const { data } = res;
      if (data.header?.code === "0000" && !data.error) {
        setPackages(data.body.packageList);
        setSelectPack(data.body.packageList[0].packageId);
        onChangePack(data.body.packageList[0].packageId);
      } else message.error("Some thing went wrong :( Try again later");
    });
  }, [user]);
  const onChangePack = (packId) => {
    setSelectPack(packId);
    setStickers(undefined);
    axios.get(`/sticker/getSticker/${packId}`).then((res) => {
      const { data } = res;
      if (data.header.code === "0000") {
        setStickers(res.data.body.package.stickers);
      }
    });
  };
  const sendSticker = (linkSticker) => {
    sendAMessage(1, linkSticker);
  };
  const fetchStickerSearched = (q) => {
    axios.get(`/sticker/search?q=${q}`).then((res) => {
      console.log(res);
      const { data } = res;
      if (data.header?.code === "0000" && !data.error) {
        setStickers(res.data.body.stickerList);
      } else message.error("Some thing went wrong :( Try again later");
    });
  };
  const debounceFetchSticker = useRef(
    debounce((nextValue) => fetchStickerSearched(nextValue), 1000)
  ).current;
  const onSearchSticker = (e) => {
    const q = e.target.value;
    setKeyword(q);
    setStickers(undefined);
    debounceFetchSticker(q);
  };
  return (
    <div className="sticker">
      <div className="sticker-bar">
        <div className="sticker-bar-pack">
          {packages ? (
            packages.slice(0, 6).map((pack) => {
              return (
                <Tooltip
                  key={pack.packageId}
                  title={pack.packageName}
                  aria-label="pack-name"
                >
                  <button
                    onClick={() => onChangePack(pack.packageId)}
                    className={pack.packageId === selectPack ? "selected" : ""}
                    width={70}
                    height={56}
                  >
                    <img src={pack.packageImg} height={56} alt="sticker-pack" />
                  </button>
                </Tooltip>
              );
            })
          ) : (
            <Skeleton width={70} height={56} count={4} />
          )}
        </div>
        <div className="btn-add">
          <Tooltip title="Add" aria-label="Recent use">
            <Fab color="inherit">
              <Add />
            </Fab>
          </Tooltip>
        </div>
      </div>
      <div className="sticker-items">
        <div className="sticker-items-search">
          <IconButton className="btn-search">
            <SearchOutlined />
          </IconButton>
          <input
            value={keyword}
            onChange={onSearchSticker}
            type="text"
            placeholder="Search for more stickers"
          />
        </div>
        {stickers ? (
          <div className="sticker-items-list">
            {stickers.map((sticker) => {
              return (
                <button
                  key={sticker.stickerId}
                  onClick={() => {
                    sendSticker(sticker.stickerImg);
                  }}
                  width={90}
                  height={90}
                >
                  <img src={sticker.stickerImg} width={90} alt="sticker-pack" />
                </button>
              );
            })}
          </div>
        ) : (
          <Skeleton width={90} height={90} count={9} />
        )}
      </div>
    </div>
  );
}

export default Sticker;
