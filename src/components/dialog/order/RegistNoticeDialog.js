import React, { Component } from "react";
import {
    Form, Input, Button, Select, Modal, Checkbox,
} from "antd";
import '../../../css/modal.css';
import { httpUrl, httpPost } from '../../../api/httpClient';
import{
  customAlert,
  updateError
} from '../../../api/Modals'

const Option = Select.Option;
const FormItem = Form.Item;

class RegistNoticeDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
            date: "",
            title: "",
            content: "",
            category: 0,
            sortOrder: 30,
            important: 0,
            branchCode: 1,
            createdate: '',
            deleteDate: '',
            readDate: '',
            deleted: false,
            registNotice: false,
            checkedImportantCall: false
        };
        this.formRef = React.createRef();
    }

    handleToggleImportantCall = (e) => {
      this.setState(
        {
          checkedImportantCall: e.target.checked,      
        },
        () => {
          if (!this.state.checkedImportantCall) {
            this.setState(
              {
                important: false,
              }
            );
          } else {
            this.setState(
              {
                important: true,
              },
            );
          }
        }
      );
    };

    componentDidMount() {
    }

    handleSubmit = () => {
        let self = this;
        let { data } = this.props;
        console.log(data)
        Modal.confirm({
            title: <div> {data ? "공지 수정" : "공지 등록" } </div>,
            content:  
            <div> {data ? '공지사항을 수정하시겠습니까?' : '새 공지사항을 등록하시겠습니까?'} </div>,
            okText: "확인",
            cancelText: "취소",
          onOk() {
              data ?
            httpPost(httpUrl.updateNotice, [], {
              ...self.formRef.current.getFieldsValue(),
              idx: data.idx,
              important: self.state.important,
            }).then((result) => {
              console.log(result)
              if(result.result === "SUCCESS" && result.data === "SUCCESS"){
                customAlert("완료", self.formRef.current.getFieldsValue().content+"이(가) 수정되었습니다.")
              } else if(result.data === "NOT_ADMIN") updateError()
              else updateError()
              self.props.close()
            }).catch((error) => {
              updateError()
            })
    
    
              //     httpPost(httpUrl.registNotice, [], {
              //         ...self.formRef.current.getFieldsValue(),
              //         date: self.state.date,
              //         title: self.state.title,
              //         category: self.state.category,
              //         sortOrder: self.state.sortOrder,
              //         important: self.state.important,
              //         branchCode: self.state.branchCode,
              //     })
              //         .then((result) => {
              //             Modal.info({
              //                 title: "공지사항",
              //                 content: (
              //                     <div>
              //                        adfds
              //                     </div>
              //                 ),
              //             });
              //             // self.getList();
              //             self.props.close()
    
              // //     this.setState({content});
              // //     this.getList();
              // // 

              :

              httpPost(httpUrl.registNotice, [], {
                ...self.formRef.current.getFieldsValue(),
                // idx: self.state.idx,
                date: self.state.date,
                // content: self.state.content,
                deleted: false,
                category: self.state.category,
                branchCode: self.state.branchCode,
                important: self.state.important,
              }).then((result) => {
                  if(result.result === "SUCCESS" && result.data === "SUCCESS"){
                    customAlert("완료", self.formRef.current.getFieldsValue().content+"이(가) 등록되었습니다.")
                  } else if(result.data === "NOT_ADMIN") updateError()
                  else updateError()
                self.props.close()
              }).catch((error) => {
                updateError()
              })
      
      
                //     httpPost(httpUrl.registNotice, [], {
                //         ...self.formRef.current.getFieldsValue(),
                //         date: self.state.date,
                //         title: self.state.title,
                //         category: self.state.category,
                //         sortOrder: self.state.sortOrder,
                //         important: self.state.important,
                //         branchCode: self.state.branchCode,
                //     })
                //         .then((result) => {
                //             Modal.info({
                //                 title: "공지사항",
                //                 content: (
                //                     <div>
                //                        adfds
                //                     </div>
                //                 ),
                //             });
                //             // self.getList();
                //             self.props.close()
      
                // //     this.setState({content});
                // //     this.getList();
                // // 
  
          }
        })
        }


    handleClear = () => {
        this.formRef.current.resetFields();
    };



    render() {
        const { data, close } = this.props;

        return (

                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="registNoticeDialog">
                                <div className="registNotice-content">
                                    <div className="registStaff-title">
                                        {data ? "공지 수정" : "공지 등록" }
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="surcharge-close" alt="닫기" />
                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="layout">
                                            <div className="registNoticeWrapper">
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        제목
                                                    </div>
                                                    <FormItem
                                                        name="title"
                                                        className="selectItem"
                                                        initialValue={data ? data.title : ''}
                                                    >   
                                                        <Input placeholder="제목을 입력해 주세요." className="override-input"/> 
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        노출순위
                                                    </div>
                                                    <FormItem
                                                        name="sortOrder"
                                                        className="selectItem"
                                                        initialValue={data ? data.sortOrder : ''}
                                                    >
                                                        <Input placeholder="숫자가 클수록 위쪽에 공지됩니다." className="override-input"/>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        중요
                                                    </div>
                                                    <FormItem
                                                        name="important"
                                                        className="selectItem"
                                                    >
                                                        <div className="importantBox">
                                                        <Checkbox
                                                        defaultChecked={data ? (data.important === true ? "checked" : "") : ""}
                                                        onChange={this.handleToggleImportantCall}></Checkbox>
                                                        </div>
                                                    </FormItem>
                                                </div>
                                            </div>
                                                <div className= "registNoticeWrapper sub">
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        내용
                                                    </div>
                                                    <FormItem
                                                        name="content"
                                                        className="selectItem"
                                                        initialValue={data ? data.content : ''}
                                                    >
                                                        <Input.TextArea
                                                        placeholder="내용을 입력해 주세요."
                                                        className="override-input notice-content"
                                                        />
                                                    </FormItem>
                                                </div>


                                                <div className="submitBlock">
                                                    <Button type="primary" htmlType="submit">
                                                        {data ? "수정하기":"등록하기"}
                                                    </Button>

                                                    {!data &&
                                                        <Button className="clearBtn" onClick={this.handleClear}>
                                                            초기화
                                                        </Button>
                                                    }
                                                </div>
                                                </div>

                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </React.Fragment>

        )
    }
}

export default (RegistNoticeDialog);