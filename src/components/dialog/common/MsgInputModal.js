import React, { Component } from "react";
import '../../../css/modal.css';
import { MessageOutlined } from '@ant-design/icons';

class MsgInputModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            msg: [
                '5분뒤 픽업해주세요.',
                '10분뒤 픽업해주세요.',
                '15분뒤 픽업해주세요.',
                '조리가 지연되고 있습니다.',
                '배달준비가 끝났습니다.',
            ],
        }
    }
    render() {
        const { isOpen, close } = this.props;
        return (
            <>
                {
                    isOpen ?
                        <>
                            <div className="msginput-modal" onClick={close} />
                            <div className="Modal">
                                <div className="msginput-container">
                                    <div className="msginput-set" style={{ color: '#fff' }}>
                                        {this.state.msg.map((value, index) => (
                                            <div key={index} className="msginput-basic" onClick={() => this.props.keyin(value)}>
                                                <div><MessageOutlined style={{ marginRight: '10px' }} />{value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        null
                }
            </>
        )
    }
}

export default (MsgInputModal)