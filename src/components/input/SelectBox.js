import React, { Component } from "react";
import { Select } from "antd";

const Option = Select.Option;

export default class SelectBox extends Component {
  state = {
    dataType: this.props.codeType
  };

  renderOption = () => {
    const { codeString } = this.props;
    let result = [];
    for (const property in codeString) {
      if (codeString[property] === "") continue
      result.push(
        <Option key={`${property}`} value={property}>
          {codeString[property]}
        </Option>
      );
    }
    return result;
  };

  render() {
    const {
      data,
      size,
      mode,
      style,
      placeholder,
      value,
      type,
      page,
      onChange,
      disable,
      className
    } = this.props;
    return (
      <>
        <Select
          className="desk"
          size={size}
          mode={mode}
          disabled={disable}
          style={{ width: "100px", ...style }}
          placeholder={placeholder}
          value={value}
          onChange={value => {
            if (type) {
              onChange(value, type);
            } else if (data) {
              if (page) {
                onChange(value, data, page);
              } else onChange(value, data);
            } else {
              onChange(value);
            }
          }}>
          {this.renderOption()}
        </Select>

        <Select
          className="mobile"
          size={size}
          mode={mode}
          disabled={disable}
          style={{ width: "70px", ...style }}
          placeholder={placeholder}
          value={value}
          onChange={value => {
            if (type) {
              onChange(value, type);
            } else if (data) {
              if (page) {
                onChange(value, data, page);
              } else onChange(value, data);
            } else {
              onChange(value);
            }
          }}>
          {this.renderOption()}
        </Select>
      </>
    );
  }
}
/**
 *
 */
