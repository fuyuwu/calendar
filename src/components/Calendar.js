import React, { Component } from "react";
import "./style.scss";
import moment from "moment";

class Calendar extends Component {
  state = {
    changeWrap: true, //切換顯示
    dataSource: [],
    initYearMonth: this.props.initYearMonth,
    data: [], //存放json出來的資料
    nowYM: 1, //當前年月
    dateData: [], //存放表頭年月陣列
    monthListArr: [],
    active: 0, //加上active的class
    dayData: []
  };
  weekList = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
  ];

  //render後執行
  componentDidMount() {
    if (typeof this.props.dataSource === "object") {
      const result = this.props.dataSource;
      this.dataSource = result;
      this.dataHandler(result);
      this.setState({
        data: result
      });
    }
    if (typeof this.props.dataSource === "string") {
      // console.log("dataSource的型別:", typeof this.props.dataSource);
      fetch(this.props.dataSource, {
        method: "GET",
        //伺服端要能夠剖析JSON字串以取出資料
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          return res.json();
          //預備轉成Json檔
        })
        .then(result => {
          this.setState({ data: result });
          this.dataHandler(result); //避免非同步
          return result;
        })
        .catch(e => console.log("錯誤:", e));
    }
  }

  //從json取出資料並sort排序
  dataHandler = data => {
    const { initYearMonth } = this.state;
    let reg = /\//g;

    // let monthListArr = [];
    let arr = data.sort(function(a, b) {
      let x = a.date.replace(reg, "");
      let y = b.date.replace(reg, "");
      return x > y ? 1 : -1;
    });

    //將日期的"/"除去
    let arr2 = [];
    for (let i = 0; i < arr.length; i++) {
      arr2.push(arr[i].date.replace(reg, "").slice(0, 6));
    }

    //Array.from(new Set())篩選並回傳不重複的值
    const result = Array.from(new Set(arr2));

    //尋找符合initYearMonth,在result陣列中的第幾個
    let nowYM = result.indexOf(initYearMonth);

    this.setState(
      {
        monthListArr: result,
        nowYM
      },
      () => {
        this.slideYM(this.state.nowYM);
      }
    );
  };

  //星期日~六
  weekShow() {
    const weekArr = [];
    for (let i = 0; i < this.weekList.length; i++) {
      weekArr.push(this.weekList[i]);
    }
    return weekArr;
  }

  //根據年月取得當月的天數與星期
  getMonthDays = () => {
    const { initYearMonth } = this.state;
    let dateTime = moment(initYearMonth).format("YYYYMM");
    // console.log("dateTime", typeof dateTime); //string
    let year = dateTime.substring(0, 4); //2018
    let month = dateTime.substring(4, 6); //10
    let dateInMonth = new Date(year, month, 0).getDate(); //取得當月的天數
    // console.log("dateInMonth", month);

    let str = `${year}/${month}`;
    let weekDate = new Date(str).getDay(); //取得星期(0-6)

    let dateArr = [];
    for (let i = 0; i < weekDate; i++) {
      dateArr.push(-1);
    }
    for (let i = 1; i <= dateInMonth; i++) {
      dateArr.push(i);
    }
    for (let i = 0; i < 42 - dateInMonth - weekDate; i++) {
      dateArr.push(-1);
    }

    return dateArr;
  };

  // 整理initYearMonth
  slideYM = nowYearMonth => {
    let { nowYM, monthListArr, initYearMonth } = this.state;
    console.log("nowYearMonth", nowYearMonth);
    let showArr = [];
    //當月
    if (!monthListArr.length) return;
    if (nowYM === 0 && initYearMonth !== monthListArr[1]) {
      showArr = [
        monthListArr[nowYM],
        monthListArr[nowYM + 1],
        monthListArr[nowYM + 2]
      ];
    } else if (nowYM >= monthListArr.length - 1) {
      showArr = [
        monthListArr[nowYM - 2],
        monthListArr[nowYM - 1],
        monthListArr[nowYM]
      ];
    } else if (initYearMonth === monthListArr[nowYearMonth]) {
      showArr = [
        monthListArr[nowYearMonth - 1],
        monthListArr[nowYearMonth],
        monthListArr[nowYearMonth + 1]
      ];
    } else if (initYearMonth === monthListArr[1]) {
      showArr = [monthListArr[0], monthListArr[1], monthListArr[2]];
    } else if (nowYearMonth === monthListArr.length - 2) {
      showArr = [
        monthListArr[nowYearMonth - 2],
        monthListArr[nowYearMonth - 1],
        monthListArr[nowYearMonth]
      ];
    }
    this.setState({ dateData: showArr });
  };

  //上個月
  prevMonth = () => {
    let { data, initYearMonth } = this.state;
    this.data = []; //onClickPrev的data
    data.map(item => {
      if (
        item["date"].substring(0, 7) ===
        moment(initYearMonth, "YYYYMM")
          .add(-1, "M")
          .format("YYYY/MM")
      ) {
        return this.data.push(item);
      }
      return false;
    });
  };
  goPrev = e => {
    if (e) {
      let $btn = e.target;
      this.props.onClickNext($btn, this.data, this);
    }
    let { nowYM, monthListArr, initYearMonth } = this.state;
    this.prevMonth();
    if (nowYM === 0) {
      nowYM = 0;
    } else {
      nowYM = nowYM - 1;
    }
    initYearMonth = monthListArr[nowYM];
    this.setState(
      {
        initYearMonth,
        nowYM
      },
      () => {
        this.slideYM(this.state.nowYM);
      }
    );
  };

  //下個月
  nextMonth = () => {
    let { data, initYearMonth } = this.state;
    this.data = []; //onClickNext的data
    data.map(item => {
      if (
        item["date"].substring(0, 7) ===
        moment(initYearMonth, "YYYYMM")
          .add(+1, "M")
          .format("YYYY/MM")
      ) {
        return this.data.push(item);
      }
      return false;
    });
  };

  goNext = e => {
    let { nowYM, monthListArr, initYearMonth } = this.state;
    this.nextMonth();
    if (e) {
      let $btn = e.target;
      this.props.onClickNext($btn, this.data, this);
    }
    if (nowYM >= monthListArr.length - 1) {
      nowYM = monthListArr.length - 1;
    } else {
      nowYM = nowYM + 1;
    }
    initYearMonth = monthListArr[nowYM];
    this.setState(
      {
        initYearMonth,
        nowYM
      },
      () => {
        this.slideYM(this.state.nowYM);
      }
    );
  };

  clickDays = e => {
    let { data, initYearMonth, dayData } = this.state;
    let day = e.currentTarget.id;
    let ym = moment(initYearMonth, "YYYYMM").format("YYYYMM");
    if (e) {
      let $date = e.currentTarget;
      this.props.onClickDate($date, dayData);
    }
    dayData = []; //onClickDate
    data.map(item => {
      if (
        item["date"] ===
        moment(`${initYearMonth}${day}`, "YYYYMMDD").format("YYYY/MM/DD")
      ) {
        console.log("initYearMonth", initYearMonth, "day:", day);
        return dayData.push(item);
      }
      return false;
    });

    this.setState(
      {
        active: `${ym}${day}`
      },
      () => {
        this.slideYM(this.state.nowYM);
      }
    );

    console.log("dayData", dayData);
  };

  //click表頭顯示相對應的資料
  getNowMonth = selectedMonth => {
    let { nowYM, monthListArr } = this.state;
    if (selectedMonth < monthListArr[nowYM]) {
      if (
        //只有最後月會有需要減2的判斷,其他-1
        selectedMonth === monthListArr[monthListArr.length - 3] && //點選的月份和所有月分中倒數第三個月份相同
        nowYM === monthListArr.length - 1 //目前被選的月份是所有月分中的最後一個
      ) {
        nowYM -= 2;
      } else {
        nowYM -= 1;
      }
    } else if (selectedMonth > monthListArr[nowYM]) {
      if (selectedMonth === monthListArr[2] && nowYM === 0) {
        //只有第一個月會有需要加2的判斷,其他都+1
        //點選的月份和所有月分中第三個月份相同 && 目前被選的月份是所有月分中的第一個
        nowYM += 2;
      } else {
        nowYM += 1;
      }
    }

    this.setState(
      {
        initYearMonth: selectedMonth,
        nowYM
      },
      () => {
        //在slideYM的function中傳入nowYearMonth,之後呼叫此function需傳入並得到已更新的值
        this.slideYM(this.state.nowYM);
      }
    );
  };
  // 切換顯示
  switch = () => {
    this.setState({
      changeWrap: !this.state.changeWrap
    });
  };

  render() {
    const { initYearMonth, changeWrap, dateData } = this.state;
    // console.log("dateData", dateData);
    return (
      <div className="App">
        <div className="switch" onClick={this.switch}>
          <i className={`fas fa-${!!changeWrap ? "calendar" : "list"}-alt`} />
          <span>{!!changeWrap ? "切換列表顯示" : "切換日曆顯示"}</span>
        </div>
        <div className="calendars">
          <div className="tabWrap">
            <a href="#" className="prev on" onClick={this.goPrev}></a>
            <ul>
              {dateData.map((item, idx) => {
                return (
                  <li
                    key={idx}
                    id={item}
                    onClick={() => this.getNowMonth(item)}
                  >
                    <span
                      className={item === initYearMonth ? "currentMonth" : " "}
                    >
                      {moment(item, "YYYYMM").format("YYYY MM[月]")}
                    </span>
                    {dateData.indexOf(initYearMonth) === initYearMonth ? (
                      <span className="no-data">無出發日</span>
                    ) : (
                      ""
                    )}
                  </li>
                );
              })}
            </ul>
            <a href="#" className="next on" onClick={this.goNext}></a>
          </div>
          <div className={!!changeWrap ? "weekWrap" : "weekWrap listWrap"}>
            {!!changeWrap &&
              this.weekShow().map((item, idx) => {
                return <div key={idx}>{item}</div>;
              })}
          </div>
          <div className={!!changeWrap ? "daysWrap " : "listWrap"}>
            {this.getMonthDays().map((date, idx) => {
              let weekend = "";
              const initYearMonth = this.state.initYearMonth;
              let newDate = date < 10 && date > 0 ? "0" + date : date;
              let row = this.state.data.find(value => {
                if (newDate > 0)
                  return (
                    value.date ===
                    moment(`${initYearMonth}${newDate}`, "YYYYMMDD").format(
                      "YYYY/MM/DD"
                    )
                  );
              });
              // 是列表 && 有資料 || 是日曆, 回傳其data
              if ((!changeWrap && !!row) || changeWrap) {
                let { active, nowYM, monthListArr } = this.state;
                if (!changeWrap && !!row) {
                  let weekDate = new Date(row["date"]).getDay();
                  weekend = this.weekList[weekDate];
                }

                return (
                  <div
                    id={date}
                    key={"days" + idx}
                    className={
                      !!row
                        ? `${monthListArr[nowYM]}${date}` === active
                          ? "days active"
                          : "days"
                        : date > 0
                        ? "days"
                        : "days disabled"
                    }
                    onClick={e => this.clickDays(e)}
                  >
                    <span className="num">{date >= 0 ? date : ""}</span>
                    <span className="weekday">{weekend}</span>
                    {date > 0 && !!row ? (
                      <HasDate
                        date={date}
                        dataKeySetting={this.props.dataKeySetting}
                        row={row}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  }
}
export default Calendar;

//component
function HasDate({ row, dataKeySetting }) {
  const status = dataKeySetting.status;
  const available = dataKeySetting.available;
  const guaranteed = dataKeySetting.guaranteed;
  const total = dataKeySetting.total;
  const price = dataKeySetting.price;
  const statusGreen =
    row[status] === "報名" || row[status] === "後補" || row[status] === "預定"
      ? "statusGreen"
      : "";
  const statusOrange =
    row[status] === "截止" || row[status] === "額滿" || row[status] === "關團"
      ? "statusOrange"
      : "";

  return (
    <>
      <span
        className={
          !!row[status] ? `status ${statusGreen}${statusOrange}` : "status"
        }
      >
        {row[status]}
      </span>
      <span className="sell">可賣：{row[available]}</span>
      <span className="group">團位：{row[total]}</span>
      {row[guaranteed] && <span className="tip">成團</span>}
      <span className="price">{"$" + row[price].toLocaleString()}</span>
    </>
  );
}
