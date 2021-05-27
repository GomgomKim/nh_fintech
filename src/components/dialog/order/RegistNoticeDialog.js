import React, { Component } from "react";
import {
    Form, Input, Button, Select, Modal, Checkbox,
} from "antd";
import '../../../css/modal.css';
import { httpUrl, httpPost } from '../../../api/httpClient';
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
            checkedCompleteCall: false,
            registNotice: false,
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
    }

    handleSubmit = () => {
        let self = this;
        let { data } = this.props;
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
              // idx: self.state.idx,
              date: self.state.date,
              // content: self.state.content,
              deleted: false,
              category: self.state.category,
              branchCode: self.state.branchCode,
              // deleted: false,
            }).then((result) => {
              Modal.info({
                title: "완료",
                content: (
                  <div>
                    {self.formRef.current.getFieldsValue().content}이(가) 등록되었습니다.
                  </div>
                ),
              });
              self.handleClear();
              self.getList();
            }).catch((error) => {
              Modal.info({
                title: "등록 오류",
                content: "오류가 발생하였습니다. 다시 시도해 주십시오."
              });
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
              .catch((error) => {
                Modal.info({
                  title: "수정 오류",
                  content: "오류가 발생하였습니다. 다시 시도해 주십시오."
                });
              })
              :
              httpPost(httpUrl.registNotice, [], {
                ...self.formRef.current.getFieldsValue(),
                // idx: self.state.idx,
                date: self.state.date,
                // content: self.state.content,
                deleted: false,
                category: self.state.category,
                branchCode: self.state.branchCode,
                // deleted: false,
              }).then((result) => {
                Modal.info({
                  title: " 완료",
                  content: (
                    <div>
                      {self.formRef.current.getFieldsValue().content}이(가) 등록되었습니다.
                    </div>
                  ),
                });
                self.handleClear();
                self.getList();
              }).catch((error) => {
                Modal.info({
                  title: "등록 오류",
                  content: "오류가 발생하였습니다. 다시 시도해 주십시오."
                });
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
                .catch((error) => {
                  Modal.info({
                    title: "수정 오류",
                    content: "오류가 발생하였습니다. 다시 시도해 주십시오."
                  });
                })
          }
        });
      }


    handleClear = () => {
        this.formRef.current.resetFields();
    };



    render() {
        const { data, isOpen, close } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="registStaff-Dialog">
                                <div className="registStaff-content">
                                    <div className="registStaff-title">
                                        {data ? "공지 수정" : "공지 등록" }
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="surcharge-close" alt="profile" />
                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="layout">
                                            <div className="registStaffWrapper">
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
                                                        내용
                                                    </div>
                                                    <FormItem
                                                        name="content"
                                                        className="selectItem"
                                                        initialValue={data ? data.content : ''}
                                                    >
                                                        <Input placeholder="내용을 입력해 주세요." className="override-input"/>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        우선순위
                                                    </div>
                                                    <FormItem
                                                        name="sortOrder"
                                                        className="selectItem"
                                                        initialValue={data ? data.sortOrder : ''}
                                                    >
                                                        <Input placeholder="공지하고 싶은 순서를 입력하세요" className="override-input"/>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        중요도
                                                    </div>
                                                    <FormItem
                                                        name="important"
                                                        className="selectItem"
                                                    >
                                                        <div className="important">
                                                        <Checkbox
                                                        onChange={this.handleToggleCompleteCall}></Checkbox>
                                                        <span className="span1">중요</span>
                                                        </div>
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
                        :
                        null
                }
            </React.Fragment>
        )
    }
}

export default (RegistNoticeDialo);