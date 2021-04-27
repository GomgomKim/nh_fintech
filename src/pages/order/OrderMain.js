import { Form, DatePicker, Input, Checkbox, Select, Table, Button, Radio, Descriptions } from 'antd';
import Icon from '@ant-design/icons';
import moment from 'moment';
import React, { Component } from 'react';
import { httpGet, httpUrl, httpDownload, httpPost, httpPut } from '../../api/httpClient';
import SelectBox from "../../components/input/SelectBox";
import TimeDelayDialog from "../../components/dialog/TimeDelayDialog";
import FilteringDialog from "../../components/dialog/FilteringDialog";
import AddCallDialog from "../../components/dialog/AddCallDialog";
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

  // 시간지연 dialog
  openTimeDelayModal = () => {
    this.setState({ timeDelayOpen: true });
  }
  closeTimeDelayModal = () => {
    this.setState({ timeDelayOpen: false });
  }

  // 할증 dialog
  openSurchargeModal = () => {
    this.setState({ surchargeOpen: true });
  }
  closeSurchargeModal = () => {
    this.setState({ surchargeOpen: false });
  }

  // 콜등록 dialog
  openAddCallModal = () => {
    this.setState({ addCallOpen: true });
  }
  closeAddCallModal = () => {
    this.setState({ addCallOpen: false });
  }

  // 필터링 dialog
  openFilteringModal = () => {
    this.setState({ filteringOpen: true });
  }
  closeFilteringModal = () => {
    this.setState({ filteringOpen: false });
  }

  render() {
    return (
      <div className="">
        {this.state.mapTab == 0 ?
          <ReceptionStatus openMapControl={this.openMapControl} /> :
          <MapControl closeMapControl={this.closeMapControl} />}
      </div>
    )
  }
}
export default OrderMain;