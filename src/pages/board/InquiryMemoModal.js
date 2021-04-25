import React, { Component, useState, useCallback } from 'react'
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import { Form, Input, Button, DatePicker, Modal, Tooltip } from 'antd'
import { reactLocalStorage } from "reactjs-localstorage";
import {
  formatDate,
  numberFormat,
  startDateFormat,
  endDateFormat
} from "../../lib/util/dateUtil";
import SelectBox from "../../components/input/SelectBox";
const FormItem = Form.Item;

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;

class InquiryMemoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
  }
  onOk = () => {
    const data = {
      idx: this.props.data.idx,
      memo: this.formRef.current.getFieldValue('memo'),
    }
    httpPost(httpUrl.inquiryUpdate, [], data).then(response => {
      if (response.data == 'SUCCESS') {
        this.props.reload();
        this.props.close();
      }
      else {
        alert('실패하였습니다. 잠시 후 다시 시도해 주세요.')
      }
    }).catch(e=>{
      alert('실패하였습니다. 잠시 후 다시 시도해 주세요.')
    })
  }
  render() {
    return (
      <>
        <Modal
          title="메모"
          visible={this.props.visible}
          okText="확인"
          cancelText="취소"
          onOk={this.onOk}
          onCancel={()=>{this.props.close()}}>
          <Form ref={this.formRef}>
            <FormItem
              name="memo"
              initialValue={this.props.data && this.props.data.memo}
            >
              <Input.TextArea
                placeholder="메모를 입력해주세요."
                
              />
            </FormItem>
          </Form>
        </Modal>
      </>
    )
  }
}
export default InquiryMemoModal;