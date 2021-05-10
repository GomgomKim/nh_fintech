import { Form, DatePicker, Input, Table, Button, Descriptions } from 'antd';
import Icon from '@ant-design/icons';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import SelectBox from "../../components/input/SelectBox";
const FormItem = Form.Item;
const Ditems = Descriptions.Item;

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;

class SettingMain extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="pwChange-root">

        <div className="pwChange-Layout">
          <div className="pwChange-title">비밀번호 변경</div><br></br>

          <div className="pwChange-box">

            <div className="twl pwChange-list">
              <td>현재 비밀번호</td>
              <div className="inputBox inputBox-pwChange sub">
                <FormItem>
                  <Input placeholder="현재 비밀번호를 입력해주세요" />
                </FormItem>
              </div>
            </div>
            <div className="twl pwChange-list">
              <td>새 비밀번호</td>
              <div className="inputBox inputBox-pwChange sub">
                <FormItem>
                  <Input placeholder="새로운 비밀번호를 입력해주세요" />
                </FormItem>
              </div>
            </div>
            <div className="twl pwChange-list">
              <td>새 비밀번호 확인</td>
              <div className="inputBox inputBox-pwChange sub">
                <FormItem>
                  <Input placeholder="새로운 비밀번호를 다시 입력해주세요" />
                </FormItem>
              </div>
            </div>
          </div>

          <div className="pwChange-btn">
            <Button
              className="tabBtn"
              onClick={() => { }}
            >변경하기</Button>


          </div>

        </div>
      </div>

    )
  }
}
export default SettingMain;