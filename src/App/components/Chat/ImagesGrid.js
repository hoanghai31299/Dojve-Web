import { message, Spin, Image } from "antd";
import React from "react";
import axios from "../../utils/axios";
import { ReactVideo } from "reactjs-media";
function ImagesGrid({ room }) {
  const [images, setImages] = React.useState();

  React.useEffect(() => {
    try {
      axios.get(`rooms/getImage/${room.current._id}`).then(({ data }) => {
        if (!data.error && data.error !== undefined) {
          setImages(data.messages);
        } else message.error("Can not get image from room");
      });
    } catch (error) {
      console.log("can not get image from room");
    }
  }, [room]);
  return (
    <div className="images-room">
      {!images ? (
        <div className="loading-images">
          <Spin />
        </div>
      ) : images && images?.length ? (
        images.map((message, i) => {
          if (message.type === 4)
            return (
              <ReactVideo
                key={i}
                primaryColor="#6A2CD8"
                width={200}
                poster={
                  message.content.substr(0, message.content.lastIndexOf(".")) +
                  ".jpg"
                }
                src={message.content}
              />
            );
          else
            return (
              <Image
                key={i}
                src={message.content}
                className="img"
                alt="message-img"
              />
            );
        })
      ) : (
        <div>This room do not share any image</div>
      )}
    </div>
  );
}

export default ImagesGrid;
