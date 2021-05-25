import { Modal } from 'antd';

const updateComplete = () => {
    Modal.info({
        title: "변경 완료",
        content: (
        <div>
            변경되었습니다.
        </div>
        ),
        onOk() {},
    });
}

const updateError = () => {
    Modal.error({
        title: "변경 실패", 
        content: (
        <div>
            변경에 실패했습니다. 관리자에게 문의하세요.
        </div>),
        onOk() {},
    });
}

const registComplete = () => {
    Modal.info({
        title: "등록 완료",
        content: (
        <div>
            등록되었습니다.
        </div>
        ),
        onOk() {},
    });
}

const registError = () => {
    Modal.error({
        title: "등록 실패", 
        content: (
        <div>
            등록에 실패했습니다. 관리자에게 문의하세요.
        </div>), 
        onOk() {}
    });
}

const deleteComplete = () => {
    Modal.info({
        title: "삭제 완료",
        content: (
        <div>
            삭제되었습니다.
        </div>
        ),
        onOk() {},
    });
}

const deleteError = () => {
    Modal.error({
        title: "삭제 실패", 
        content: (
        <div>
            삭제에 실패했습니다. 관리자에게 문의하세요.
        </div>), 
        onOk() {},
    });
}

export {
    updateComplete,
    updateError,
    registComplete,
    registError,
    deleteComplete,
    deleteError,
}