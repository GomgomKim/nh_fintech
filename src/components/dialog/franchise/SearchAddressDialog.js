import React, { Component } from "react";
import {
    Form, Input, Table,
    Button, Select, Radio
} from "antd";
import { httpUrl, httpGet } from '../../../api/httpClient';
import PostCodeDialog from '../common/PostCodeDialog';
import { 

} from '../../../lib/util/codeUtil'
import {
    customError,
} from '../../../api/Modals'

import '../../../css/rider.css';

const FormItem = Form.Item;

const Option = Select.Option;
const Search = Input.Search;
const today = new Date();


class SearchAddressDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedDate: today,
            list: [],
            isPostCodeOpen: false,
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
            },
            addressType: 0,

            roadAddr: "",
            localAddr: "",
            searchAddress: "",


        };
        this.formRef = React.createRef();
    }
    componentDidMount() {
        this.getList()
    }

    setDate = (date) => {
        console.log(date)
    }

    handleTableChange = (pagination) => {
        console.log(pagination)
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize
        this.setState({
            pagination: pager,
        }, () => this.getList());
    };


    getList = () => {
        var list = [
            {
                idx: 5,
                KindOfAddress: '오피스텔',
                addressList: '잠실 푸르지오시티 106동',
                delete: this.state.blocked
            },
            {
                idx: 4,
                KindOfAddress: '오피스텔',
                addressList: '잠실 푸르지오시티 106동',
                delete: this.state.blocked
            },
            {
                idx: 3,
                KindOfAddress: '오피스텔',
                addressList: '잠실 푸르지오시티 106동',
                delete: this.state.blocked
            },
            {
                idx: 2,
                KindOfAddress: '아파트',
                addressList: '잠실 푸르지오시티 106동',
                delete: this.state.blocked
            },
            {
                idx: 1,
                KindOfAddress: '아파트',
                addressList: '잠실 푸르지오시티 106동',
                delete: this.state.blocked
            },

        ];
        this.setState({
            list: list,
        });
    }

    // 우편번호 검색
    openPostCode = () => {
        this.setState({ isPostCodeOpen: true,})
    }

    closePostCode = () => {
        this.setState({ isPostCodeOpen: false,})
    }

    // 우편번호 - 주소 저장
    getAddr = (addrData) => {
        console.log(addrData)
        // console.log(addrData.address)
        this.formRef.current.setFieldsValue({
            addr1: addrData.roadAddress, // 도로명 주소
            addr3: addrData.jibunAddress === "" ? addrData.autoJibunAddress : addrData.jibunAddress // 지번
        })

        // 좌표변환
        httpGet(httpUrl.getGeocode, [addrData.roadAddress], {}).then((res) => {
            let result = JSON.parse(res.data.json);
            // console.log(result)
            // console.log(result.addresses.length)
            if(res.result === "SUCCESS" && result.addresses.length > 0){
                const lat = result.addresses[0].y;
                const lng = result.addresses[0].x;
                // console.log(lat)
                // console.log(lng)

                this.setState({
                    targetLat: lat,
                    targetLng: lng
                }) 
                
            } else{
                customError("위치 반환 오류", "위치 데이터가 존재하지 않습니다. 관리자에게 문의하세요.")
            }
          
        });
    }
       // 주소 검색
       onSearchAddress = (value) => {
        this.setState({
            searchAddress: value
        }, () => {
            this.getList();
        })
    }

    render() {


        const onChange = (e) => {
            console.log(e.target.value)
            this.setState({
                addressType: e.target.value
            }, () => {
            })
        }

        const columns = [
            {
                title: "종류",
                dataIndex: "KindOfAddress",
                className: "table-column-center",
                width: "20%",
            },
            {
                title: "등록 주소 목록",
                dataIndex: "addressList",
                className: "table-column-center",
                width: "60%",
            },
            {
                title: "삭제",
                dataIndex: "delete",
                className: "table-column-center",
                width: "20%",
                render:
                    (data) => (
                        <div className="pwChange-btn">
                            <Button
                                className="tabBtn"
                                onClick={() => { }}
                            >삭제</Button>
                        </div>
                    ),
            },

        ];

        const { isOpen, close, data } = this.props;

        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="serchAddress-Dialog">
                                <div className="serchAddress-content">
                                    <div className="serchAddress-title">
                                        주소 검색 관리
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="surcharge-close" alt=""/>


                                    <Form ref={this.formRef} onFinish={this.handleSubmit}>
                                        <div className="layout">                                            
                                            <div className="serchAddressWrapper">

                                                <div className="searchAddress-name">
                                                    주소 등록
                                                </div>

                                                    <div className="contentbox">

                                                        <div className="contentBlock frist">

                                                            <div className="mainTitle">
                                                                유형
                                                            </div>

                                                            <Radio.Group className="searchRequirement" onChange={onChange} value={this.state.addressType}>
                                                                <Radio value={0}>아파트</Radio>
                                                                <Radio value={1}>오피스텔</Radio>
                                                            </Radio.Group> 

                                                        </div>

                                                        <div className="contentBlock">

                                                            <div className="mainTitle">
                                                                주소
                                                            </div>

                                                            <FormItem
                                                                name="addr1"
                                                                className="selectItem"                                                                                                                        >
                                                                <Input placeholder="주소를 입력해 주세요." disabled className="override-input sub short" />
                                                            </FormItem>

                                                            <PostCodeDialog data={(addrData) => this.getAddr(addrData)} isOpen={this.state.isPostCodeOpen} close={this.closePostCode}/>

                                                            <Button onClick={this.openPostCode} className="override-input addrBtn">
                                                                우편번호 검색
                                                            </Button>

                                                        </div>


                                                        <div className="contentBlock">

                                                            <div className="mainTitle">
                                                                지번주소
                                                            </div>

                                                            <FormItem
                                                                name="addr3"
                                                                className="selectItem"                                                                                                                                                                                >
                                                                <Input placeholder="지번주소를 입력해 주세요." disabled className="override-input sub"/>
                                                            </FormItem>
                                                        </div>


                                                        <div className="contentBlock">

                                                            <div className="mainTitle">
                                                                상세주소
                                                            </div>

                                                            <FormItem
                                                                name="addr2"
                                                                className="selectItem"                                                                                                                        >
                                                                <Input placeholder="상세주소를 입력해 주세요." className="override-input sub"/>
                                                            </FormItem>
                                                        </div>       

                                                    </div>  

                                                        <div className="searchAddress-btn">
                                                            <Button type="primary" htmlType="submit">
                                                                등록하기
                                                            </Button>
                                                        </div>
                                            </div>

                                                <div className="searchAddress-name">
                                                        주소 검색
                                                </div>

                                                <div className="contentbox-02">

                                                    <div className="contentBlock">

                                                        <div className="mainTitle">
                                                            유형
                                                        </div>

                                                        <Radio.Group className="searchRequirement" onChange={onChange} value={this.state.addressType}>
                                                            <Radio value={0}>아파트</Radio>
                                                            <Radio value={1}>오피스텔</Radio>
                                                        </Radio.Group> 

                                                    </div>

                                                    <div className="contentBlock bottom">

                                                                <div className="mainTitle">
                                                                    주소
                                                                </div>

                                                                <Search
                                                                    placeholder="주소를 검색해 주세요."
                                                                    enterButton
                                                                    allowClear
                                                                    onSearch={this.onSearchAddress}
                                                                    style={{
                                                                        width: 480,
                                                                        marginLeft: 20,
                                                                        verticalAlign: 'bottom'
                                                                    }}
                                                                />
                                                    </div>                                                

                                                </div>                                     


                                            <div className="dataTableLayout-01">
                                                <Table
                                                    dataSource={this.state.list}
                                                    columns={columns}
                                                    pagination={this.state.pagination}
                                                    onChange={this.state.handleTableChange}
                                                />
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

export default (SearchAddressDialog);