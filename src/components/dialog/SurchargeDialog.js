import React, { Component } from "react";
import '../../css/modal.css';

class SurchargeDialog extends Component {
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
                            <div className="Dialog">
                                <div className="servicePop-title">
                                    <img onClick={close} src={require('../../img/login/close.png').default} className="servicePop-title-1" />
                                </div>
                                <div className="servicePop-content">

                                    <div className="agree_inner">
                                        example dialog
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

export default (SurchargeDialog);