import { React, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { reactLocalStorage } from "reactjs-localstorage";
import { httpGet, httpPost, httpUrl } from "../../../api/httpClient";
import Const from "../../../const";
import { formatYMDHMS } from "../../../lib/util/dateUtil";

const ChattingCurrentRoom = ({ currentRoomIdx, close }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessageCurrent, setChatMessageCurrent] = [];
  const [chatMessageEnd, setChatMessageEnd] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [lastChatTime, setLastChatTime] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);

  const loginIdx = useSelector((state) => state.login.loginInfo.idx);

  useEffect(() => {
    getCurrentRoom();
    let value = reactLocalStorage.getObject(Const.appName + ":chat");
    if (value !== null) {
      try {
        value = JSON.parse(value);
        setLastChatTime(value);
        updateTime(currentRoomIdx);
      } catch {}
    }
  }, []);

  const getCurrentRoom = () => {
    httpGet(httpUrl.chatList, [10, 1], {})
      .then((result) => {
        console.log("getCurrentRoom");
        console.log(result);
        setCurrentRoom(
          result.data.chatRooms.find((i) => i.idx === currentRoomIdx)
        );
      })
      .catch();
  };

  const getChatDetail = () => {
    if (chatMessageEnd) return;
    httpGet(
      httpUrl.chatMessageList,
      [10, chatMessageCurrent + 1, currentRoomIdx],
      {}
    )
      .then((result) => {
        result = result.data;
        console.log(result);
        if (result.chatMessages.length === 0) {
          this.setState({
            chatMessageEnd: true,
            chatMessages: chatMessages,
          });
          return;
        }
        if (chatMessageCurrent === result.currentPage) result.chatMessages = [];

        this.setState({
          chatMessages: chatMessages.concat(result.chatMessages),
          chatMessageCurrent: result.currentPage,
        });
      })
      .catch();
  };

  const onPressSend = (inputMessage) => {
    if (!currentRoom) return;
    const receiveUserIdx =
      currentRoom.member1 === loginIdx
        ? currentRoom.member2
        : currentRoom.member1;
    httpPost(httpUrl.chatSend, [], {
      chatMessage: inputMessage,
      receiveUserIdx,
    }).then((result) => {
      console.log("SUCCESS");
      result = result.data;
      if (result === "SUCCESS") {
        const newChatMessages = chatMessages;
        newChatMessages.unshift({
          chatDate: formatYMDHMS(new Date()),
          chatMessage: inputMessage,
          chatRoomCreateDate: "",
          chatRoomIdx: null,
          idx: 0,
          isRead: null,
          member1: currentRoom.member1,
          member2: currentRoom.member2,
          readDate: null,
          receiveUserIdx: receiveUserIdx,
          sendUserIdx: loginIdx,
          title: "chat room",
        });
        setChatMessages(newChatMessages);
        updateTime(currentRoom.idx);
        // updateLastChatMessage(currentRoom.idx, inputMessage);
      }
    });
  };

  const updateTime = (currentRoomIdx) => {
    //방열릴때
    let value = reactLocalStorage.getObject(Const.appName + ":chat");
    const currentTime = formatYMDHMS(new Date());
    if (value !== null) {
      try {
        if (value) value = JSON.parse(value);
        else value = [];

        let currentRoom = value.find((x) => x.idx === currentRoomIdx);
        if (currentRoom) {
          currentRoom.lastChatDate = currentTime;
        } else {
          value.push({
            idx: currentRoomIdx,
            lastChatDate: currentTime,
          });
          console.log("#### updatetime");
          console.log(value);
        }
        reactLocalStorage.setObject(
          Const.appName + ":chat",
          JSON.stringify(value)
        );

        setLastChatTime(value);
      } catch {}
    }
  };

  const formatChatName = (item) => {
    const name =
      item.member1 === loginIdx ? item.member2Name : item.member1Name;
    return name ? name : "(알수없음)";
  };

  return (
    <>
      <div className={"Modal-overlay"} onClick={close} />
      <div className={"Modal-chat"}>
        <div className="chat-message-container">
          <div className="chat-title">
            {currentRoom ? formatChatName(currentRoom) : ""}
          </div>
          <div className="chat-message" id="chat-message">
            <InfiniteScroll
              dataLength={chatMessages.length}
              next={getChatDetail}
              style={{
                display: "flex",
                flexDirection: "column-reverse",
              }}
              inverse={true}
              hasMore={!chatMessageEnd}
              scrollableTarget="chat-message"
            >
              {chatMessages.map((row, index) => {
                if (row.sendUserIdx === loginIdx)
                  return (
                    <div className="chat-message-item my">
                      <div className="chat-message-content my">
                        <div className="chat-message-content-text my">
                          {row.chatMessage}
                        </div>
                        <div className="chat-message-content-date my">
                          {row.chatDate}
                        </div>
                      </div>
                    </div>
                  );
                else
                  return (
                    <div className="chat-message-item">
                      <div className="chat-message-icon">
                        <img
                          src={
                            require("../../../img/chatting/chat_default.png")
                              .default
                          }
                          alt=""
                        />
                      </div>
                      <div className="chat-message-content">
                        <div className="chat-message-content-text">
                          {row.chatMessage}
                        </div>
                        <div className="chat-message-content-date">
                          {row.chatDate}
                        </div>
                      </div>
                    </div>
                  );
              })}
            </InfiniteScroll>
          </div>
          <div className="chat-input">
            <input
              className="chat-send-input"
              placeholder="메세지를 입력해주세요."
              onChange={(e) => setInputMessage(e.target.value)}
              value={inputMessage}
            />
            <div
              className="chat-send-btn"
              onClick={() => {
                onPressSend(inputMessage);
                setInputMessage("");
              }}
            >
              전송
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChattingCurrentRoom;
