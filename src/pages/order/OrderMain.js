import { Form, DatePicker, Input, Checkbox, Select, Table, Button, Descriptions } from 'antd';
import Icon from '@ant-design/icons';
import moment from 'moment';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import SelectBox from "../../components/input/SelectBox";
import TimeDelayDialog from "../../components/dialog/TimeDelayDialog";
import { formatDate } from "../../lib/util/dateUtil";
import "../../css/order.css";
import { comma } from "../../lib/util/numberUtil";
import SurchargeDialog from "../../components/dialog/SurchargeDialog";
import MapControl from "./MapControl"
import ReceptionStatus from "./ReceptionStatus"

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
      mapTab: 0,
    };
  }

  componentDidMount() {
  }

  openMapControl = () => {
    // console.log("open")
    this.setState({
      mapTab: 1
    });
  }

  closeMapControl = () => {
    // console.log("open")
    this.setState({
      mapTab: 0
    });
  }

  render() {
    return (
      <div className="">
        {this.state.mapTab == 0 ? 
        <ReceptionStatus openMapControl = {this.openMapControl}/> : 
        <MapControl closeMapControl = {this.closeMapControl}/>}
      </div>
    )
  }
}
export default OrderMain;