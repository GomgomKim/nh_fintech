import React, { Component } from "react";
import {
    Form, Input, Button, Modal, Checkbox,
} from "antd";
import '../../../css/modal.css';
import { httpUrl, httpPost } from '../../../api/httpClient';
import { noticeCategoryType } from "../../../lib/util/codeUtil";
import SelectBox from "../../../components/input/SelectBox";
import{
  customAlert,
  updateError
} from '../../../api/Modals';


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
            category: 1,
            sortOrder: 30,
            important: 0,
            branchIdx: 1,
            createDate: '',
            deleteDate: '',
            readDate: '',
            deleted: false,
            registNotice: false,
            checkedImportantCall: false,
            
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
              category: self.state.category,
            }).then((result) => {
              console.log(result)
              if(result.result === "SUCCESS" && result.data === "SUCCESS"){
                customAlert("완료", self.formRef.current.getFieldsValue().title+"이(가) 수정되었습니다.")
              }
              else updateError()
              self.props.close()
            }).catch((error) => {
              updateError()
            })

              :

              httpPost(httpUrl.registNotice, [], {
                ...self.formRef.current.getFieldsValue(),
                // idx: self.state.idx,
                createDate: self.state.createDate,
                // content: self.state.content,
                deleted: false,
                category: self.state.category,
                branchIdx: self.state.branchIdx,
                important: self.state.important,
              }).then((result) => {
                  if(result.result === "SUCCESS" && result.data === "SUCCESS"){
                    customAlert("완료", self.formRef.current.getFieldsValue().title+"이(가) 등록되었습니다.")
                  }
                  else updateError()
                self.props.close()
              }).catch((error) => {
                updateError()
              })
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
                            <div className="Regist-Notice-Dialog-overlay" onClick={close} />
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
                                                        rules={[{ required: true, message: "제목을 입력해주세요." }]}
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
                                                        rules={[{ required: true, message: "노출순위를 입력해주세요." }]}
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
                                                        defaultChecked={data ? (data.important ? "checked" : "") : ""}
                                                        onChange={this.handleToggleImportantCall}></Checkbox>
                                                        </div>
                                                    </FormItem>
                                                    <div className="subTitle">
                                                        대상 지정
                                                    </div>
                                                    <FormItem
                                                        name="category"
                                                        className="selectItem"
                                                    >
                                                      <div style={{marginLeft:-45}}>
                                                      <SelectBox
                                                        placeholder={'전체'}
                                                        value={noticeCategoryType[this.state.franStatus]}
                                                        code={Object.keys(noticeCategoryType)}
                                                        codeString={noticeCategoryType}
                                                        onChange={(value) => {
                                                            if (value) {
                                                                this.setState({ category: value}
                                                              );
                                                            }
                                                          }}
                                                        />
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
                                                        rules={[{ required: true, message: "내용을 입력해주세요." }]}
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