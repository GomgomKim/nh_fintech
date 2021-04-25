import React, { useEffect } from "react";
import { Result, Button } from "antd";
import { withRouter } from "react-router-dom";

const NotFound = (props) => {
  useEffect(() => {
    console.log(JSON.stringify(props, null, 4));
    return () => {};
  });
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button
          type="primary"
          onClick={() => {
            props.history.push("/");
          }}>
          Back Home
        </Button>
      }
    />
  );
};

export default withRouter(NotFound);
