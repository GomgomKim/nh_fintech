import React, { Component } from "react";
import {
    Form, Input, DatePicker, Button, Select, Radio
} from "antd";
import '../../../css/modal.css';
// import MapContainer from "./MapContainer";
import { NaverMap, Marker, Polyline } from 'react-naver-maps'


const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Search = Input.Search;
const lat = 37.518663;
const lng = 127.040514;

class RegistCallDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
    }
    render() {

        const { isOpen, close } = this.props;
        const navermaps = window.naver.maps;


        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="registCall-Dialog">
                                <div className="registCall-container">
                                    <div className="registCall-title">
                                        콜등록
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="surcharge-close" />


                                    <Form ref={this.formIdRef} onFinish={this.handleIdSubmit}>
                                        <div className="registCallLayout">
                                            <div className="registCallWrapper">
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        가맹점명
                                                </div>
                                                    <FormItem
                                                        name="franchiseName"
                                                        className="selectItem"
                                                    >
                                                        <Select placeholder="가맹점을 선택해 주세요." className="override-select fran">
                                                            <Option value={0}>플러스김포 / 플러스김포</Option>
                                                            <Option value={1}>김포1지점 / 플러스김포</Option>
                                                            <Option value={2}>김포2지점 / 플러스김포</Option>
                                                        </Select>
                                                    </FormItem>
                                                    <Search
                                                        placeholder="가맹점검색"
                                                        enterButton
                                                        allowClear
                                                        onSearch={this.onSearchFranchisee}
                                                        style={{
                                                            width: 190,
                                                            marginLeft: 10
                                                        }}
                                                    />
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        준비시간
                                                        </div>
                                                    <FormItem
                                                        name="preparationTime"
                                                        className="selectItem"
                                                    >
                                                        <Select placeholder="시간단위" className="override-select time">
                                                            <Option value={1}>1</Option>
                                                            <Option value={2}>2</Option>
                                                            <Option value={3}>3</Option>
                                                        </Select>
                                                    </FormItem>
                                                    <FormItem
                                                        style={{
                                                            marginLeft: 10,
                                                            display: 'inline-block',
                                                            verticalAlign: 'middle',
                                                        }}
                                                        name="payType"
                                                        initialValue={0}
                                                    >
                                                        <Radio.Group>
                                                            <Radio style={{ fontSize: 16 }} value={0}>과금</Radio>
                                                            <Radio style={{ fontSize: 18 }} value={1}>과적</Radio>
                                                        </Radio.Group>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        도착지
                                                </div>
                                                    <FormItem
                                                        name="addrMain"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="도착지를 선택해 주세요." className="override-input">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        상세주소
                                                </div>
                                                    <FormItem
                                                        name="addrSub"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="상세주소를 입력해 주세요." className="override-input">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                            </div>




                                            <div className="registCallWrapper sub">
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        메모
                                                </div>
                                                    <FormItem
                                                        name="callmemo"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="메모를 입력해 주세요." className="override-input memo">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        가격
                                                    </div>
                                                    <FormItem
                                                        name="callprice"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="가격 입력" className="override-input price">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="contentBlock">
                                                    <div className="mainTitle">
                                                        배달요금
                                                    </div>
                                                    <FormItem
                                                        name="callAmount"
                                                        className="selectItem"
                                                    >
                                                        <Input placeholder="배달요금 입력" className="override-input delprice">
                                                        </Input>
                                                    </FormItem>
                                                </div>
                                                <div className="m-t-10">
                                                    <FormItem
                                                        style={{
                                                            marginBottom: 0,
                                                            display: 'inline-block',
                                                            verticalAlign: 'middle',
                                                        }}
                                                        name="payType"
                                                        initialValue={0}
                                                    >
                                                        <Radio.Group>
                                                            <Radio style={{ fontSize: 18 }} value={0}>현금</Radio>
                                                            <Radio style={{ fontSize: 18 }} value={1}>카드</Radio>
                                                            <Radio style={{ fontSize: 18 }} value={2}>선결</Radio>
                                                        </Radio.Group>
                                                    </FormItem>
                                                </div>
                                                <Button type="primary" htmlType="submit" className="callTab">
                                                    등록하기
                                                </Button>
                                            </div>

                                            <div className="mapLayout" id="myMap">
                                                {/* <MapContainer /> */}
                                                <NaverMap
                                                    className='map-navermap'
                                                    defaultZoom={14}
                                                    center={{ lat: lat, lng: lng }}
                                                >
                                                <Marker
                                                    position={new navermaps.LatLng(lat, lng)}
                                                    icon={require('../../../img/login/map/marker_rider.png').default}
                                                />
                                                <Marker
                                                    position={new navermaps.LatLng(this.props.frLat, this.props.frLng)}
                                                    icon={require('../../../img/login/map/marker_target.png').default}
                                                />
                                                <Polyline 
                                                path={[
                                                    new navermaps.LatLng(this.props.frLat, this.props.frLng),
                                                    new navermaps.LatLng(lat, lng),
                                                ]}
                                                // clickable // 사용자 인터랙션을 받기 위해 clickable을 true로 설정합니다.
                                                strokeColor={'#5347AA'}
                                                strokeWeight={5}        
                                                />
                                                </NaverMap>
                                            </div>



                                        </div>
                                    </Form>




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

export default (RegistCallDialog);