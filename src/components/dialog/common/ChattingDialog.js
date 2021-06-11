import { Pagination } from "antd";
import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { connect } from "react-redux";
import { reactLocalStorage } from "reactjs-localstorage";
import { bindActionCreators } from "redux";
import { login, logout } from "../../../actions/loginAction";
import { httpGet, httpPost, httpUrl } from "../../../api/httpClient";
import Const from "../../../const";
import { formatYMD, formatYMDHMS } from "../../../lib/util/dateUtil";

class ChattingDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      pagination: {
        current: 1,
        total: 0,
      },
      chatMessages: [],
      chatMessageCurrent: 0,
      chatMessageEnd: false,

      lastChatTime: {},

      currentRoom: null,
      keyInputModalOpen: false,
    };
  }
  componentDidMount() {
    this.getChatList();
    let value = reactLocalStorage.getObject(Const.appName + ":chat");

    if (value !== null) {
      try {
        value = JSON.parse(value);
        this.setState({ lastChatTime: value });
      } catch {}
    }
  }
  formatChatDate(time) {
    return time.substr(0, 10) === formatYMD(new Date())
      ? time.substr(12, time.length)
      : time.substr(0, 10);
  }
  formatChatName(item) {
    const name =
      item.member1 === this.props.loginReducer.loginInfo.idx
        ? item.member2RiderName
        : item.member1RiderName;
    return name ? name : "(알수없음)";
  }
  updateTime = (idx) => {
    //방열릴때
    let value = reactLocalStorage.getObject(Const.appName + ":chat");
    const currentTime = formatYMDHMS(new Date());
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
          console.log("#### updatetime");
          console.log(value);
        }
        reactLocalStorage.setObject(
          Const.appName + ":chat",
          JSON.stringify(value)
        );

        this.setState({ lastChatTime: value });
      } catch {}
    }
  };

  getChatList = () => {
    let pageNum = this.state.pagination.current;
    httpGet(httpUrl.chatList, [10, pageNum], {})
      .then((result) => {
        const pagination = { ...this.state.pagination };
        pagination.current = result.data.currentPage;
        pagination.total = result.data.totalCount;
        this.setState({
          tableData: result.data.chatRooms,
          pagination,
        });
      })
      .catch();
  };
  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState(
      {
        pagination: pager,
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
        console.log(result);
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
      console.log("SUCCESS");
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
        console.log(this.state.chatMessages);
        this.setState({ chatMessages: this.state.chatMessages });
        this.updateTime(currentRoom.idx);
        this.updateLastChatMessage(currentRoom.idx, msg);
      }
    });
  };
  render() {
    const {  close } = this.props;
    const { currentRoom } = this.state;
    return (
      <>
        <div className={"Modal-overlay"} onClick={close} />
        <div className={"Modal-chat"}>

          {currentRoom && (
            <div className="chat-message-container">
              <div className="chat-title">
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
              <div className="chat-input">
                <input
                  className="chat-send-input"
                  placeholder="메세지를 입력해주세요."
                  onChange={(e) => this.setState({ sendMsg: e.target.value })}
                  value={this.state.sendMsg}
                />
                <div
                  className="chat-send-btn"
                  onClick={() => {
                    this.onPressSend(this.state.sendMsg);
                    this.setState({ sendMsg: "" });
                  }}
                >
                  전송
                </div>
              </div>
            </div>
          )}
          <div className="chat-container">
            <div className="chat-title">냠냠톡</div>
            <div className="chat-list-container">
              {this.state.tableData.map((row, index) => {
                return (
                  <div
                    className="chat-item-container"
                    onClick={() => {
                      this.chatDetailList(row);
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
                      <div className="chat-item-bottom">{row.lastMessage}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center" }}>
              <Pagination
                onChange={this.handlePageChange}
                defaultCurrent={1}
                pageSize={10}
                total={this.state.pagination.total}
              />
            </div>
          </div>
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
