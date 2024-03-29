import { Button, Pagination } from "antd";
import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { connect } from "react-redux";
import { reactLocalStorage } from "reactjs-localstorage";
import { bindActionCreators } from "redux";
import { login, logout } from "../../../actions/loginAction";
import { httpGet, httpPost, httpUrl } from "../../../api/httpClient";
import Const from "../../../const";
import { riderLevelText } from "../../../lib/util/codeUtil";
import {
  formatYMD,
  formatYMDHM,
  formatYMDHMS,
} from "../../../lib/util/dateUtil";
import SearchFranchiseDialog from "./SearchFranchiseDialog";
import SearchRiderDialog from "./SearchRiderDialog";

class ChattingDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // totalTableData: [],
      tableData: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 5,
      },
      chatMessages: [],
      chatMessageCurrent: 0,
      chatMessageEnd: false,

      lastChatTime: {},

      currentRoom: null,
      keyInputModalOpen: false,

      searchRiderOpen: false,
      searchFranOpen: false,
      selectedFr: null,
      selectedRider: null,

      fakeRoom: false,
      inputMessage: "",
    };
  }
  componentDidMount() {
    this.getChatList();
    // this.getTotalChatList();
    let value = reactLocalStorage.getObject(Const.appName + ":chat");

    if (value !== null) {
      try {
        value = JSON.parse(value);
        this.setState({ lastChatTime: value });
      } catch {}
    }

    global.chatAprear = true;
    global.chatListener = (data) => {

      this.updateLastChatMessage(data.idx, data.lastMessage);
      this.updateTime(data.idx);

      if (this.state.currentRoom && this.state.currentRoom.idx == data.idx) {
          this.state.chatMessages.unshift({
              chatDate: formatYMDHMS(new Date()), 
              chatMessage: data.lastMessage, 
              chatRoomCreateDate: "", 
              chatRoomIdx: null, 
              idx: 0, 
              isRead: null, 
              member1: data.member1, 
              member2: data.member2, 
              readDate: null, 
              receiveUserIdx: this.props.loginReducer.loginInfo.idx, 
              sendUserIdx: this.props.loginReducer.loginInfo.idx == data.member1 ? data.member2 : data.member1, 
              title: "chat room"
          });
          this.setState({chatMessages:this.state.chatMessages})
      }
    }
  }
  componentWillUnmount() {
    global.chatAprear = false;
    
    global.chatListener = null;
  }
  formatChatDate(time) {
    return time.substr(0, 10) === formatYMD(new Date())
      ? time.substr(11, time.length)
      : time.substr(0, 10);
  }
  formatChatName(item) {
    const name =
      item.member1 === this.props.loginReducer.loginInfo.idx
        ? item.member2Data.userType === 1
          ? item.member2Data.riderName
          : item.member2Data.frName
        : item.member1Data.userType === 1
        ? item.member1Data.riderName
        : item.member1Data.frName;
    return name ? name : "(알수없음)";
  }
  updateTime = (idx) => {
    //방열릴때
    let value = reactLocalStorage.getObject(Const.appName + ":chat");
    const currentTime = formatYMDHM(new Date());
    if (value !== null) {
      try {
        if (value) value = JSON.parse(value);
        else value = [];

        let currentRoom = value.find((x) => x.idx === idx);
        if (currentRoom) {
          currentRoom.lastChatDate = currentTime;
        } else {
          value.push({
            idx: idx,
            lastChatDate: currentTime,
          });
        }
        reactLocalStorage.setObject(
          Const.appName + ":chat",
          JSON.stringify(value)
        );

        this.setState({ lastChatTime: value });
      } catch {}
    }
  };

  getChatRoom = (receiverUserIdx) => {
    httpGet(httpUrl.chatRoom, [receiverUserIdx], {})
      .then((res) => {
        if (res.result === "SUCCESS" && res.data.chatRooms.length > 0) {
          this.chatDetailList(res.data.chatRooms[0]);
          this.setState({ fakeRoom: false });
          return;
        } else {
          this.setState({ fakeRoom: true });
        }
      })
      .catch((e) => {
        console.log(e);
        throw e;
      });
  };

  getChatList = () => {
    httpGet(
      httpUrl.chatList,
      [this.state.pagination.pageSize, this.state.pagination.current],
      {}
    )
      .then((result) => {
        this.setState({
          tableData: result.data.chatRooms,
          pagination: {
            ...this.state.pagination,
            total: result.data.totalCount,
          },
        });
      })
      .catch();
  };

  getFirstItem = () => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          current: 1,
        },
      },
      () => {
        httpGet(
          httpUrl.chatList,
          [this.state.pagination.pageSize, this.state.pagination.current],
          {}
        )
          .then((result) => {
            this.setState(
              {
                tableData: result.data.chatRooms,
              },
              () => this.chatDetailList(this.state.tableData[0])
            );
          })
          .catch();
      }
    );
  };

  handlePagesChange = (current) => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          current: current,
        },
      },
      () => this.getChatList()
    );
  };
  // 채팅상세
  chatDetailList = (item) => {
    this.setState(
      {
        currentRoom: item,
        chatMessages: [],
        chatMessageCurrent: 0,
        chatMessageEnd: false,
      },
      () => this.getChatDetail()
    );
    this.updateTime(item.idx);
  };
  getChatDetail = () => {
    if (this.state.chatMessageEnd) return;
    httpGet(
      httpUrl.chatMessageList,
      [10, this.state.chatMessageCurrent + 1, this.state.currentRoom.idx],
      {}
    )
      .then((result) => {
        result = result.data;

        if (result.chatMessages.length === 0) {
          this.setState({
            chatMessageEnd: true,
            chatMessages: this.state.chatMessages,
          });
          return;
        }
        if (this.state.chatMessageCurrent === result.currentPage)
          result.chatMessages = [];

        this.setState({
          chatMessages: this.state.chatMessages.concat(result.chatMessages),
          chatMessageCurrent: result.currentPage,
        });
      })
      .catch();
  };

  updateLastChatMessage = (idx, message) => {
    const target = this.state.tableData.find((x) => x.idx === idx);
    if (target) {
      target.lastMessage = message;
      this.setState({ tableDate: this.state.tableData });
    }
  };
  onPressSend = (msg) => {
    if (!this.state.currentRoom) return;
    const { currentRoom } = this.state;
    const receiveUserIdx =
      currentRoom.member1 === this.props.loginReducer.loginInfo.idx
        ? currentRoom.member2
        : currentRoom.member1;
    httpPost(httpUrl.chatSend, [], {
      chatMessage: msg,
      receiveUserIdx,
    }).then((result) => {
      result = result.data;
      if (result === "SUCCESS") {
        this.state.chatMessages.unshift({
          chatDate: formatYMDHMS(new Date()),
          chatMessage: msg,
          chatRoomCreateDate: "",
          chatRoomIdx: null,
          idx: 0,
          isRead: null,
          member1: currentRoom.member1,
          member2: currentRoom.member2,
          readDate: null,
          receiveUserIdx: receiveUserIdx,
          sendUserIdx: this.props.loginReducer.loginInfo.idx,
          title: "chat room",
        });
        this.setState({ chatMessages: this.state.chatMessages });
        this.updateTime(currentRoom.idx);
        this.updateLastChatMessage(currentRoom.idx, msg);
      }
    });
  };

  send = (callback1, callback2) => {
    httpPost(httpUrl.chatSend, [], {
      chatMessage: this.state.inputMessage,
      receiveUserIdx: this.state.selectedFr
        ? this.state.selectedFr.idx
        : this.state.selectedRider.idx,
    })
      .then((res) => {
        if (res.result === "SUCCESS") {
          callback1();
          callback2();
          this.setState({ inputMessage: "" });
        } else {
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  render() {
    const { close } = this.props;
    const { currentRoom } = this.state;
    return (
      <>
        {this.state.searchFranOpen && (
          <SearchFranchiseDialog
            close={() => this.setState({ searchFranOpen: false })}
            callback={(data) => {
              this.setState(
                { selectedFr: data, selectedRider: null, currentRoom: null },
                () => {
                  console.log(this.state.selectedFr);
                  console.log(this.state.selectedRider);

                  this.getChatRoom(this.state.selectedFr.idx);
                }
              );
            }}
          />
        )}
        {this.state.searchRiderOpen && (
          <SearchRiderDialog
            close={() => this.setState({ searchRiderOpen: false })}
            callback={(data) =>
              this.setState(
                { selectedRider: data, selectedFr: null, currentRoom: null },
                () => {
                  console.log(this.state.selectedFr);
                  console.log(this.state.selectedRider);

                  this.getChatRoom(this.state.selectedRider.idx);
                }
              )
            }
          />
        )}

        <div className={"Modal-overlay"} onClick={close} />
        <div className={"Modal-chat"}>
          <div className="chat-container">
            <div className="chat-subbox">
              <div className="chat-title">냠냠톡</div>
              <div className="chat-list-container">
                <div className="search-wrapper">
                  <Button
                    className="search-btn"
                    onClick={() => this.setState({ searchFranOpen: true })}
                  >
                    가맹점검색
                  </Button>
                  <Button
                    className="search-btn"
                    onClick={() => this.setState({ searchRiderOpen: true })}
                  >
                    라이더검색
                  </Button>
                </div>

                {this.state.tableData.map((row, index) => {
                  return (
                    <div
                      className="chat-item-container"
                      onClick={() => {
                        this.setState(
                          {
                            fakeRoom: false,
                            currentRoom: false,
                            selectedRider: null,
                            selectedfr: null,
                          },
                          () => {
                            this.chatDetailList(row);
                            const receiver =
                              this.props.loginReducer.idx === row.member1
                                ? row.member1Data
                                : row.member2Data;
                            if (receiver.userType === 1) {
                              this.setState({ selectedRider: receiver });
                            }
                          }
                        );
                      }}
                    >
                      <div className="chat-item-image">
                        <img
                          src={
                            require("../../../img/chatting/chat_default.png")
                              .default
                          }
                          alt=""
                        />
                      </div>
                      <div className="chat-item-content">
                        <div className="chat-item-top">
                          <div className="chat-item-top-time">
                            {this.formatChatDate(row.lastChatDate)}
                          </div>
                          <div className="chat-item-top-title">
                            {this.formatChatName(row)}
                          </div>
                        </div>
                        <div className="chat-item-bottom">
                          {row.lastMessage}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="chat-page" style={{ textAlign: "center" }}>
              <Pagination
                onChange={this.handlePagesChange}
                defaultCurrent={1}
                pageSize={this.state.pagination.pageSize}
                total={this.state.pagination.total}
              />
            </div>
          </div>
          {currentRoom && (
            <div className="chat-message-container">
              <div className="chat-title">
                {this.state.selectedRider &&
                  riderLevelText[this.state.selectedRider.riderLevel] + " "}
                {this.formatChatName(currentRoom)}
              </div>
              <div className="chat-message" id="chat-message">
                <InfiniteScroll
                  dataLength={this.state.chatMessages.length}
                  next={this.getChatDetail}
                  style={{
                    display: "flex",
                    flexDirection: "column-reverse",
                  }}
                  inverse={true}
                  hasMore={!this.chatMessageEnd}
                  scrollableTarget="chat-message"
                >
                  {this.state.chatMessages.map((row, index) => {
                    if (
                      row.sendUserIdx === this.props.loginReducer.loginInfo.idx
                    )
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
              <div className="chat-input-box">
                <div className="chat-input">
                  <input
                    className="chat-send-input"
                    placeholder="메세지를 입력해주세요."
                    onChange={(e) =>
                      this.setState({ inputMessage: e.target.value })
                    }
                    value={this.state.inputMessage}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        this.onPressSend(this.state.inputMessage);
                        this.setState({ inputMessage: "" });
                      }
                    }}
                  />
                  <div
                    className="chat-send-btn"
                    onClick={() => {
                      this.onPressSend(this.state.inputMessage);
                      this.setState({ inputMessage: "" });
                    }}
                  >
                    전송
                  </div>
                </div>
              </div>
            </div>
          )}
          {this.state.fakeRoom && (
            <div className="chat-message-container">
              <div className="chat-title">
                {this.state.selectedRider &&
                  riderLevelText[this.state.selectedRider.riderLevel] + " "}
                {this.state.selectedFr
                  ? this.state.selectedFr.frName
                  : this.state.selectedRider.riderName}
              </div>
              <div className="chat-message" id="chat-message">
                <InfiniteScroll
                  dataLength={0}
                  style={{
                    display: "flex",
                    flexDirection: "column-reverse",
                  }}
                ></InfiniteScroll>
              </div>
              <div className="chat-input">
                <input
                  className="chat-send-input"
                  placeholder="메세지를 입력해주세요."
                  onChange={(e) =>
                    this.setState({ inputMessage: e.target.value })
                  }
                  value={this.state.inputMessage}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {this.send(
                      () => {
                        this.getChatRoom(
                          this.state.selectedFr !== null
                            ? this.state.selectedFr.idx
                            : this.state.selectedRider.idx
                        );
                      },
                      () => {
                        this.setState(
                          {
                            pagination: {
                              ...this.state.pagination,
                              current: 1,
                            },
                            inputMessage: ""
                          },
                          () => this.getChatList()
                        );
                      }
                    );

                    }
                  }}
                />
                <div
                  className="chat-send-btn"
                  onClick={() => {this.send(
                    () => {
                      this.getChatRoom(
                        this.state.selectedFr !== null
                          ? this.state.selectedFr.idx
                          : this.state.selectedRider.idx
                      );
                    },
                    () => {
                      this.setState(
                        {
                          pagination: {
                            ...this.state.pagination,
                            current: 1,
                          },
                          inputMessage: ""
                        },
                        () => this.getChatList()
                      );
                    }
                  );
                  }}
                >
                  전송
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  loginReducer: state.login,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ login, logout }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(ChattingDialog);
