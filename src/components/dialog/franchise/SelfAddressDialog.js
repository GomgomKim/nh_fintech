import React, { Component } from "react";
import "../../../css/modal.css";
import { Form, Input, Table, Button, Modal, Select } from "antd";
import { formatDate } from "../../../lib/util/dateUtil";
import "../../../css/order.css";
import { comma } from "../../../lib/util/numberUtil";
// import MapContainer from "./MapContainer";
import { httpGet, httpUrl, httpPost } from "../../../api/httpClient";
import { NaverMap, Marker } from "react-naver-maps";
import {} from "../../../lib/util/codeUtil";

const Option = Select.Option;
const FormItem = Form.Item;
const navermaps = window.naver.maps;
// const { Option } = Radio;
const Search = Input.Search;
const lat = 37.643623625321474;
const lng = 126.66509442649551;

class SelfAddressDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { close } = this.props;

    return (
      <>
        <div className="Dialog-overlay" onClick={close} />
        <div className="map-address-Dialog">
          <img
            onClick={close}
            src={require("../../../img/login/close.png").default}
            className="map-close"
            alt=""
          />
          <div className="mapLayout">
            {navermaps && (
              <NaverMap
                className="map-navermap"
                defaultZoom={16}
                center={{ lat: lat, lng: lng }}
              ></NaverMap>
            )}
          </div>
          <div className="map-address-btn">
            <Button type="primary" htmlType="submit" className="map-btn">
              등록하기
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default SelfAddressDialog;
