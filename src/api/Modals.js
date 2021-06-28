import { Modal } from 'antd';

const customAlert = (t, c) => {
    Modal.info({
        title: t,
        content: (
        <div>
            {c}
        </div>
        ),
        onOk() {},
    });
}

const customError = (t, c) => {
    Modal.error({
        title: t,
        content: (
        <div>
            {c}
        </div>
        ),
        onOk() {},
    });
}

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

const blindComplete = () => {
    Modal.info({
        title: "차단 완료",
        content: (
        <div>
            차단 되었습니다.
        </div>
        ),
        onOk() {},
    });
}

const blindError = () => {
    Modal.error({
        title: "차단 실패", 
        content: (
        <div>
            차단에 실패했습니다.
        </div>), 
        onOk() {},
    });
}

const blindNowError = () => {
    Modal.error({
        title: "차단 에러", 
        content: (
        <div>
            같은 상태로는 바꿀수 없습니다.
        </div>), 
        onOk() {},
    });
}

const unBlindComplete = () => {
    Modal.info({
        title: "차단 해제",
        content: (
        <div>
            차단 해제되었습니다.
        </div>
        ),
        onOk() {},
    });
}

const unBlindError = () => {
    Modal.error({
        title: "해제 실패", 
        content: (
        <div>
            차단해제에 실패했습니다.
        </div>), 
        onOk() {},
    });
}



const unBlindAgree = () => {
    Modal.info({
        title: "차단 승인",
        content: (
        <div>
            해당 블라인드를 승인하였습니다.
        </div>
        ),
        onOk() {},
    });
}

const unBlindDeny = () => {
    Modal.error({
        title: "차단 거부", 
        content: (
        <div>
            해당 블라인드를 거부하였습니다.
        </div>), 
        onOk() {},
    });
}

const unBlindAgreeError = () => {
    Modal.error({
        title: "처리 실패", 
        content: (
        <div>
            서버에러로 인해 처리에 실패했습니다.
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
    blindComplete,
    blindError,
    blindNowError,
    unBlindComplete,
    unBlindError,
    customError,
    customAlert,
    unBlindAgree,
    unBlindDeny,
    unBlindAgreeError,
}