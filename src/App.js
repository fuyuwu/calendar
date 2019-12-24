import React, { Component } from "react";
import "./App.css";
import Calender from "./components/Calendar";

class App extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  switch = () => {
    return this.child.current.switch();
  };
  nextMonth = () => {
    return this.child.current.nextMonth();
  };
  prevMonth = () => {
    return this.child.current.prevMonth();
  };
  inputData = data => {
    let calendarData = this.child.current.state.data;
    this.child.current.setState({
      data: [...data, ...calendarData]
    });
  };

  resetData = data => {
    this.child.current.setState({
      data: [...data]
    });
  };

  destory = () => {
    this.child.current.setState({
      data: []
    });
  };

  render() {
    return (
      <Calender
        ref={this.child}
        dataSource="./json/data1.json"
        initYearMonth="201810"
        dataKeySetting={{
          // 保證出團 "guaranteed","certain"另一支檔案
          guaranteed: "guaranteed",
          // 狀態 "status", "state"
          status: "status",
          // 可賣團位 "availableVancancy", "onsell"
          available: "availableVancancy",
          // 團位 "totalVacnacy","total"
          total: "totalVacnacy",
          // 價格
          price: "price"
        }}
        onClickPrev={function($btn, data, module) {
          console.log($btn, data, module);
        }}
        // 點下一個月時
        onClickNext={function($btn, data, module) {
          console.log($btn, data, module);
        }}
        // 點日期時
        onClickDate={function($date, data) {
          console.log($date, data);
        }}
      ></Calender>
    );
  }
}

export default App;
