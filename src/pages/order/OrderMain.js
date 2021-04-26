import { Form, DatePicker, Input, Checkbox, Select, Table, Button, Descriptions } from 'antd';
import Icon from '@ant-design/icons';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import SelectBox from "../../components/input/SelectBox";
import TimeDelayDialog from "../../components/dialog/TimeDelayDialog";
const FormItem = Form.Item;
const Ditems = Descriptions.Item;

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;

class OrderMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeDelayOpen: false,
    };
  }

  componentDidMount() {
  }

  openTimeDelayModal = () => {
    this.setState({ timeDelayOpen: true });
  }
  closeTimeDelayModal = () => {
    this.setState({ timeDelayOpen: false });
  }

  render() {
    return (
      <div>
        <TimeDelayDialog isOpen={this.state.timeDelayOpen} close={this.closeTimeDelayModal} />
        <div className="" onClick={this.openTimeDelayModal}>
          time delay
        </div>
      </div>
    )
  }
}
export default OrderMain;