import { Form, DatePicker, Input, Checkbox, Select, Table, Button, Radio, Descriptions } from 'antd';
import Icon from '@ant-design/icons';
import moment from 'moment';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import "../../css/order.css";
import "../../css/common.css";
import MapControl from "./MapControl"
import ReceptionStatus from "./ReceptionStatus"
import MapControlDialog from "../../components/dialog/order/MapControlDialog"

const FormItem = Form.Item;
const Ditems = Descriptions.Item;

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY/MM/DD';
const today = new Date();

class OrderMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapControlOpen: false,
    };
  }

  componentDidMount() {
  }

  //기사 등록 
  openMapControlModal = () => {
    this.setState({ mapControlOpen: true });
  }
  closeMapControlModal = () => {
    this.setState({ mapControlOpen: false });
  }

  render() {
    return (
      <div className="">
        {this.state.mapControlOpen ?
          <MapControlDialog 
            isOpen={this.state.mapControlOpen} close={this.closeMapControlModal}
            closeMapControl={this.closeMapControlModal} /> :
          <ReceptionStatus openMapControl={this.openMapControlModal} />}
      </div>
    )
  }
}
export default OrderMain;