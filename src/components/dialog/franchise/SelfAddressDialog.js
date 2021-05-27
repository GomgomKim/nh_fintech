import React, { Component } from "react";
import '../../../css/modal.css';
import { Form, Input, Table, Button, Modal, Select } from 'antd';
import { formatDate } from "../../../lib/util/dateUtil";
import "../../../css/order.css";
import { comma } from "../../../lib/util/numberUtil";
// import MapContainer from "./MapContainer";
import { httpGet, httpUrl, httpPost} from '../../../api/httpClient';
import { NaverMap, Marker, } from 'react-naver-maps';
import {
  
} from '../../../lib/util/codeUtil';


const Option = Select.Option;
const FormItem = Form.Item;
const navermaps = window.naver.maps;
// const { Option } = Radio;
const Search = Input.Search;
const lat = 37.643623625321474;
const lng = 126.66509442649551;

class SelfAddressDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {        
        }
    }

    componentDidMount() {
        //this.getList()
    }
    
    setDate = (date) => {
        console.log(date)
    }
    
   
    getList = ()  => {
        let selectedRiderIdx = this.state.selectedRiderIdx;
        console.log(selectedRiderIdx)
        httpGet(httpUrl.riderLocate, [selectedRiderIdx], {}).then((result) => {
          // console.log('### nnbox result=' + JSON.stringify(result, null, 4))
          // console.log('### nnbox result=' + JSON.stringify(result.data.orders, null, 4))
          const pagination = { ...this.state.pagination };
          if(result.data != null){
            var list = [result.data.orders];
            // console.log(list)
            this.setState({
              riderOrderList: list,
              pagination,
            });
          }
          else{
            this.setState({
              riderOrderList: [],
            });
          }
        })
    }
    
    locationHandler = (e) => {
        let self = this;

        Modal.confirm({
            title: "위치 선택",
            content: (
                <div>
                    {self.formRef.current.getFieldsValue().content + '를 선택하시겠습니까?'}
                </div>
            ),
            okText: "확인",
            cancelText: "취소",
            onOk() {

            }
        })
    }

      
    render() {
        const { isOpen, close } = this.props;    

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />

                            <div className="map-address-Dialog">

                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="map-close" alt="" />                                    

                                        <div className="mapLayout">
                                        
                                            {/* <MapContainer/> */}
                                           


                                            {navermaps &&
                                              <NaverMap
                                              className='map-navermap'                                      
                                              defaultZoom={16}
                                              center={{ lat: lat, lng: lng }}
                                              >     
                                     
                                              </NaverMap>                                              
                                            }                                                  
                                                
                                        </div> 
                                <div className="map-address-btn"> 

                                    <Button type="primary" htmlType="submit" className="map-btn">
                                     등록하기
                                    </Button> 
                                    
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

export default (SelfAddressDialog);