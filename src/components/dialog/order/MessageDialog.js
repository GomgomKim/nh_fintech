import React, { Component } from "react";
import { Image } from 'antd';
import '../../../css/modal.css';
import '../../../css/modal_m.css';

class MessageDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        const { isOpen, close } = this.props;
        return (
            <React.Fragment>
                {
                    isOpen ?
                        <React.Fragment>
                            <div className="Dialog-overlay" onClick={close} />
                            <div className="message-Dialog">

                                <div className="message-content">
                                    <div className="message-title">
                                        메세지 보내기
                                    </div>
                                    <img onClick={close} src={require('../../../img/login/close.png').default} className="message-close" />


                                    <div className="message-inner">
                                        <Image src={require('../../../img/contents.png').default} />
                                    </div>


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

export default (MessageDialog);