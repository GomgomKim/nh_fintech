import React, { Component } from 'react';

export class BasicDialog extends Component {
    render() {
        const { open, close } = this.props;

        return (
            <div className={open ? 'openModal modal' : 'modal'}>
                { open ? (
                    <section>
                        <div className="modalHeader">
                            <button className="exitBtn" onClick={close}></button>
                        </div>
                        <main>
                            {this.props.children}
                        </main>
                    </section>
                ) : null}
            </div>
        )
    }
}