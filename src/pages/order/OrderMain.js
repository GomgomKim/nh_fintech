import { Form, DatePicker, Input, Table, Button, Descriptions } from 'antd';
import Icon from '@ant-design/icons';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import SelectBox from "../../components/input/SelectBox";
import SurchargeDialog from "../../components/dialog/SurchargeDialog";
const FormItem = Form.Item;
const Ditems = Descriptions.Item;

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;

class OrderMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surchargeOpen: false,
    };
  }

  componentDidMount() {
  }

  openSurchargeModal = () => {
    this.setState({ surchargeOpen: true });
  }
  closeSurchargeModal = () => {
    this.setState({ surchargeOpen: false });
  }

  render() {
    return (
      <div>
        <SurchargeDialog isOpen={this.state.surchargeOpen} close={this.closeSurchargeModal} />
        <div className="" onClick={this.openSurchargeModal}>
          example dialog
        </div>
      </div>
    )
  }
}
export default OrderMain;